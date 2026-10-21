/* Olmo · carrito lateral (CartDrawer): líneas, barra de envío gratis y totales */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});
  var $ = O.$, eur = O.eur, esc = O.esc;

  var hoja = $("#cesta"), lista = $("#cesta-lineas"), pie = $("#cesta-pie"), vacia = $("#cesta-vacia");
  var msg = $("#envio-msg"), barra = $("#envio-barra"), relleno = $("#envio-relleno"), titulo = $("#cesta-titulo");

  function linea(l) {
    var p = l.producto;
    var opciones = O.MOLIENDAS.map(function (m) { return '<option value="' + m.id + '"' + (m.id === l.molienda ? " selected" : "") + ">" + m.nombre + "</option>"; }).join("");
    var f = O.FRECUENCIAS.filter(function (x) { return x.id === l.frecuencia; })[0];
    var modo = l.modo === "suscripcion" ? "Suscripción · " + (f ? f.nombre.toLowerCase() : "") : "Compra única";
    var k = esc(l.clave);
    return '<li class="flex gap-4 py-5" data-clave="' + k + '">' +
      '<img src="' + O.img(p.foto, 200) + '" alt="" width="80" height="80" class="size-20 shrink-0 rounded-2xl bg-arena object-cover">' +
      '<div class="min-w-0 flex-1">' +
      '<div class="flex items-start justify-between gap-3"><h3 class="font-serif text-lg leading-tight">' + esc(p.nombre) + "</h3>" +
      '<p class="text-[15px] font-medium tabular-nums">' + eur(l.total) + "</p></div>" +
      '<p class="mt-0.5 text-xs text-carbon/60">' + esc(p.peso) + " · " + esc(modo) +
      (l.modo === "suscripcion" ? ' · <span class="text-cafe">−' + Math.round(O.CONFIG.descuentoSuscripcion * 100) + " %</span>" : "") + "</p>" +
      '<label class="mt-2 block"><span class="sr-only">Molienda de ' + esc(p.nombre) + '</span>' +
      '<select data-accion="moler" class="w-full rounded-full border border-linea bg-crema px-3 py-2 text-sm">' + opciones + "</select></label>" +
      '<div class="mt-3 flex items-center justify-between">' +
      '<div class="flex items-center rounded-full border border-linea" role="group" aria-label="Cantidad de ' + esc(p.nombre) + '">' +
      '<button type="button" class="grid size-9 place-items-center rounded-full transition hover:bg-arena" data-accion="menos" aria-label="Quitar una unidad">' + O.iconos.menos + "</button>" +
      '<span class="w-7 text-center text-sm tabular-nums" aria-live="polite">' + l.cantidad + "</span>" +
      '<button type="button" class="grid size-9 place-items-center rounded-full transition hover:bg-arena disabled:opacity-30" data-accion="mas" aria-label="Añadir una unidad"' + (l.cantidad >= O.CONFIG.maxPorLinea ? " disabled" : "") + ">" + O.iconos.mas + "</button></div>" +
      '<button type="button" class="text-sm text-carbon/60 underline-offset-4 transition hover:text-carbon hover:underline" data-accion="quitar" aria-label="Quitar ' + esc(p.nombre) + ' de la cesta">Quitar</button>' +
      "</div></div></li>";
  }

  function fila(txt, valor, extra) {
    return '<div class="flex justify-between ' + (extra || "") + '"><dt>' + txt + '</dt><dd class="tabular-nums">' + valor + "</dd></div>";
  }

  function pintar(r) {
    var hay = r.unidades > 0;
    titulo.textContent = "Tu cesta" + (hay ? " (" + r.unidades + ")" : "");
    vacia.hidden = hay; pie.hidden = !hay; lista.hidden = !hay;

    // Barra de envío gratis: el ancho se fija por CSSOM para que la transición anime
    var pct = Math.round(r.progreso * 100);
    relleno.style.width = (hay ? pct : 0) + "%";
    barra.setAttribute("aria-valuenow", String(hay ? pct : 0));
    barra.classList.toggle("conseguido", r.gratis);
    msg.innerHTML = !hay ? "Envío gratis a partir de <strong>" + eur(O.CONFIG.envioGratisDesde) + "</strong>"
      : r.gratis ? O.iconos.camion + "<span>¡Genial! Tu pedido tiene <strong>envío gratis</strong></span>"
      : "<span>Te faltan <strong>" + eur(r.falta) + "</strong> para el envío gratis</span>";

    // Se repinta la lista entera; se devuelve el foco al mismo control para no perderlo con el teclado
    var activo = document.activeElement, quedar = null;
    if (activo && lista.contains(activo) && activo.dataset.accion) {
      var li = activo.closest("li");
      quedar = { k: li.dataset.clave, a: activo.dataset.accion };
    }
    lista.innerHTML = r.lineas.map(linea).join("");
    if (quedar) {
      var nuevo = O.$$("li", lista).filter(function (x) { return x.dataset.clave === quedar.k; })[0];
      var c = nuevo && $('[data-accion="' + quedar.a + '"]:not(:disabled)', nuevo);
      (c || $('[data-accion="quitar"]', lista) || hoja).focus();
    }

    $("#cesta-totales").innerHTML =
      fila("Subtotal", eur(r.subtotal + r.ahorro)) +
      (r.ahorro ? fila("Ahorro por suscripción", "−" + eur(r.ahorro), "text-cafe") : "") +
      fila("Envío", r.gratis ? "Gratis" : eur(r.envio)) +
      fila("Total", eur(r.total), "mt-2 border-t border-linea pt-3 text-lg font-semibold");
  }

  lista.addEventListener("click", function (e) {
    var b = e.target.closest("[data-accion]"); if (!b || b.tagName === "SELECT") return;
    var k = b.closest("li").dataset.clave, l = O.carrito.resumen().lineas.filter(function (x) { return x.clave === k; })[0];
    if (!l) return;
    if (b.dataset.accion === "mas") O.carrito.cantidad(k, l.cantidad + 1);
    else if (b.dataset.accion === "menos") O.carrito.cantidad(k, l.cantidad - 1);
    else if (b.dataset.accion === "quitar") O.carrito.quitar(k);
  });
  lista.addEventListener("change", function (e) {
    if (e.target.dataset.accion === "moler") O.carrito.moler(e.target.closest("li").dataset.clave, e.target.value);
  });

  $("#pagar").addEventListener("click", function () {
    O.aviso("Esto es una demostración: aquí empezaría el pago seguro.");
  });
  $("#cesta-seguir").addEventListener("click", function () { O.cerrarHoja(hoja); });

  O.drawer = {
    abrir: function () { O.abrirHoja(hoja); },
    cerrar: function () { O.cerrarHoja(hoja); },
  };
  O.carrito.suscribir(pintar);
})();
