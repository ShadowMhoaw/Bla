/* Olmo · catálogo (ProductCard) y hoja de personalización (molienda y suscripción) */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});
  var $ = O.$, eur = O.eur, esc = O.esc;

  var grid = $("#grid"), cuenta = $("#cuenta"), vacio = $("#vacio"), filtros = $("#filtros");
  var hoja = $("#personalizar"), formHoja = $("#personalizar-form");
  var estado = { filtro: "todos", q: "", modo: {} };
  var moliendaPrevia = O.leer("olmo-molienda", "grano");
  var enHoja = null; // { id, modo }

  function modoDe(id) { return estado.modo[id] || "unica"; }

  function coincide(p) {
    if (estado.filtro === "packs" && p.tipo !== "pack") return false;
    if ((estado.filtro === "filtro" || estado.filtro === "espresso") && p.uso.indexOf(estado.filtro) < 0) return false;
    if (!estado.q) return true;
    return O.norm([p.nombre, p.origen, p.notas.join(" ")].join(" ")).indexOf(O.norm(estado.q)) > -1;
  }

  function intensidad(n) {
    var h = "";
    for (var i = 1; i <= 5; i++) h += '<span class="size-1.5 rounded-full ' + (i <= n ? "bg-carbon" : "bg-carbon/20") + '"></span>';
    return '<span class="flex items-center gap-2 text-xs text-carbon/60">Intensidad <span class="flex gap-1" role="img" aria-label="' + n + ' de 5">' + h + "</span></span>";
  }

  function precioHTML(p, modo) {
    if (modo !== "suscripcion") return '<span class="font-serif text-2xl">' + eur(p.precio) + "</span>";
    return '<span class="font-serif text-2xl">' + eur(O.precioUnidad(p, modo)) + "</span>" +
      '<span class="text-sm text-carbon/50 line-through">' + eur(p.precio) + "</span>" +
      '<span class="rounded-full bg-cafe/10 px-2 py-0.5 text-xs font-semibold text-cafe">−' + Math.round(O.CONFIG.descuentoSuscripcion * 100) + " %</span>";
  }

  function tarjeta(p) {
    var modo = modoDe(p.id), n = "modo-" + p.id, ahorro = Math.round(O.CONFIG.descuentoSuscripcion * 100);
    var notas = p.notas.map(function (x) { return '<li class="rounded-full border border-linea px-2.5 py-1 text-xs text-carbon/80">' + esc(x) + "</li>"; }).join("");
    return '<article class="tarjeta entra flex flex-col" data-id="' + p.id + '">' +
      '<div class="relative aspect-[5/4] overflow-hidden rounded-3xl bg-arena sm:aspect-[4/5]">' +
      '<img src="' + O.img(p.foto, 640) + '" srcset="' + O.img(p.foto, 480) + " 480w, " + O.img(p.foto, 800) + ' 800w" sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 92vw" alt="' + esc(p.alt) + '" width="640" height="800" loading="lazy" decoding="async" class="size-full object-cover transition duration-700 ease-suave hover:scale-105">' +
      (p.etiqueta ? '<span class="absolute left-3 top-3 rounded-full bg-crema/95 px-3 py-1 text-xs font-semibold text-carbon shadow-sm">' + esc(p.etiqueta) + "</span>" : "") +
      "</div>" +
      '<div class="flex flex-1 flex-col pt-4">' +
      '<p class="eyebrow !tracking-[.14em]">' + esc(p.origen) + "</p>" +
      '<h3 class="mt-1 font-serif text-[1.65rem] leading-tight">' + esc(p.nombre) + "</h3>" +
      '<p class="mt-3 text-xs font-medium text-carbon/60">Notas de cata</p>' +
      '<ul class="mt-1.5 flex flex-wrap gap-1.5">' + notas + "</ul>" +
      '<div class="mt-3">' + intensidad(p.intensidad) + "</div>" +
      '<div class="mt-4 flex items-baseline gap-2" data-precio>' + precioHTML(p, modo) + '<span class="ml-auto text-sm text-carbon/60">' + esc(p.peso) + "</span></div>" +
      '<fieldset class="mt-4"><legend class="sr-only">Tipo de compra de ' + esc(p.nombre) + "</legend>" +
      '<div class="grid grid-cols-2 rounded-full bg-arena p-1 text-sm">' +
      '<label class="cursor-pointer"><input class="peer sr-only" type="radio" name="' + n + '" value="unica"' + (modo === "unica" ? " checked" : "") + '>' +
      '<span class="block rounded-full px-3 py-2 text-center transition peer-checked:bg-crema peer-checked:font-medium peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cafe">Compra única</span></label>' +
      '<label class="cursor-pointer"><input class="peer sr-only" type="radio" name="' + n + '" value="suscripcion"' + (modo === "suscripcion" ? " checked" : "") + '>' +
      '<span class="block rounded-full px-3 py-2 text-center transition peer-checked:bg-crema peer-checked:font-medium peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cafe">Suscripción <span class="text-cafe">−' + ahorro + " %</span></span></label>" +
      "</div></fieldset>" +
      '<button type="button" class="btn btn-primario mt-4 w-full" data-anadir="' + p.id + '">Añadir al carrito</button>' +
      "</div></article>";
  }

  function pintar() {
    var lista = O.PRODUCTOS.filter(coincide);
    grid.innerHTML = lista.map(tarjeta).join("");
    O.$$(".tarjeta", grid).forEach(function (t, i) { t.style.animationDelay = Math.min(i, 6) * 60 + "ms"; }); // por CSSOM, no en línea: compatible con CSP estrictas
    vacio.hidden = lista.length > 0;
    var txt = lista.length + (lista.length === 1 ? " producto" : " productos");
    if (estado.q) txt += " para «" + estado.q + "»";
    cuenta.textContent = txt; // textContent: lo que escribe la persona nunca se interpreta como HTML
    O.$$("[data-filtro]", filtros).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filtro === estado.filtro)); });
  }

  /* ── Filtros y búsqueda ── */
  filtros.addEventListener("click", function (e) {
    var b = e.target.closest("[data-filtro]");
    if (b) { estado.filtro = b.dataset.filtro; pintar(); }
  });
  $("#vacio-quitar").addEventListener("click", function () { O.productos.limpiar(); });

  /* ── Modalidad en la tarjeta: se actualiza el precio sin repintar (así no se pierde el foco) ── */
  grid.addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    var t = e.target.closest(".tarjeta"), p = O.producto(t.dataset.id);
    estado.modo[p.id] = e.target.value;
    $("[data-precio]", t).innerHTML = precioHTML(p, e.target.value) + '<span class="ml-auto text-sm text-carbon/60">' + esc(p.peso) + "</span>";
  });
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-anadir]");
    if (b) abrirHoja(b.dataset.anadir);
  });

  /* ── Hoja: elegir molienda (y frecuencia si es suscripción) ── */
  function textoBoton() {
    var p = O.producto(enHoja.id);
    $("#personalizar-confirmar").textContent = "Añadir · " + eur(O.precioUnidad(p, enHoja.modo));
  }
  function abrirHoja(id) {
    var p = O.producto(id), modo = modoDe(id);
    enHoja = { id: id, modo: modo };
    var susc = modo === "suscripcion";
    formHoja.innerHTML =
      '<div class="flex items-start gap-4">' +
      '<img src="' + O.img(p.foto, 200) + '" alt="" width="72" height="72" class="size-[4.5rem] rounded-2xl bg-arena object-cover">' +
      '<div class="min-w-0 flex-1"><p class="eyebrow !tracking-[.14em]">' + esc(p.origen) + "</p>" +
      '<h2 id="personalizar-titulo" class="font-serif text-2xl leading-tight">' + esc(p.nombre) + "</h2>" +
      '<p class="mt-1 text-sm text-carbon/60">' + (susc ? "Suscripción · " + eur(O.precioUnidad(p, modo)) + " (ahorras " + Math.round(O.CONFIG.descuentoSuscripcion * 100) + " %)" : "Compra única · " + eur(p.precio)) + "</p></div>" +
      '<button type="button" class="icono-btn !size-10" data-cerrar aria-label="Cerrar">' + icono("x") + "</button></div>" +
      '<fieldset class="mt-6"><legend class="text-sm font-semibold">¿Cómo lo prepara?</legend>' +
      '<div class="mt-3 grid gap-2">' +
      O.MOLIENDAS.map(function (m) {
        return '<label class="cursor-pointer"><input class="peer sr-only" type="radio" name="molienda" value="' + m.id + '"' + (m.id === moliendaPrevia ? " checked" : "") + ">" +
          '<span class="flex items-center gap-3 rounded-2xl border border-linea px-4 py-3 transition hover:border-carbon/40 peer-checked:border-carbon peer-checked:bg-arena peer-checked:[&_.punto]:scale-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cafe">' +
          '<span class="grid size-5 shrink-0 place-items-center rounded-full border border-carbon/40"><span class="punto size-2.5 scale-0 rounded-full bg-carbon transition"></span></span>' +
          '<span class="min-w-0"><span class="block text-[15px] font-medium">' + m.nombre + '</span><span class="block text-xs text-carbon/60">' + m.nota + "</span></span></span></label>";
      }).join("") + "</div></fieldset>" +
      (susc ? '<div class="mt-5"><label for="frecuencia" class="text-sm font-semibold">¿Cada cuánto lo recibe?</label>' +
        '<select id="frecuencia" name="frecuencia" class="mt-2 w-full rounded-full border border-linea bg-crema px-4 py-3 text-[15px]">' +
        O.FRECUENCIAS.map(function (f) { return '<option value="' + f.id + '">' + f.nombre + "</option>"; }).join("") + "</select>" +
        '<p class="mt-2 text-xs text-carbon/60">Sin permanencia: se pausa o se cancela cuando quiera.</p></div>' : "") +
      '<button id="personalizar-confirmar" type="submit" class="btn btn-primario mt-6 w-full"></button>';
    textoBoton();
    O.abrirHoja(hoja);
    var marcado = $('input[name="molienda"]:checked', formHoja); if (marcado) marcado.focus();
  }
  formHoja.addEventListener("submit", function (e) {
    e.preventDefault();
    var m = $('input[name="molienda"]:checked', formHoja), f = $("#frecuencia", formHoja);
    if (!m || !enHoja) return;
    moliendaPrevia = m.value; O.guardar("olmo-molienda", moliendaPrevia);
    O.carrito.agregar({ id: enHoja.id, molienda: m.value, modo: enHoja.modo, frecuencia: f ? f.value : 2, cantidad: 1 });
    O.cerrarHoja(hoja, true);
    O.drawer.abrir();
  });

  function icono(n) { return O.iconos[n]; }

  /* ── API para el resto de módulos ── */
  O.productos = {
    pintar: pintar,
    filtrar: function (f) { estado.filtro = f; estado.q = ""; pintar(); },
    buscar: function (q) { estado.q = q; estado.filtro = "todos"; pintar(); },
    limpiar: function () { estado.q = ""; estado.filtro = "todos"; pintar(); O.navbar && O.navbar.limpiarBusqueda(); },
    /* Lleva hasta un café concreto, quitando antes los filtros que lo esconderían */
    ir: function (id) {
      if (!coincide(O.producto(id))) { estado.q = ""; estado.filtro = "todos"; pintar(); }
      var t = $('.tarjeta[data-id="' + id + '"]', grid);
      if (!t) return;
      t.scrollIntoView({ behavior: "smooth", block: "center" });
      t.classList.remove("realce"); void t.offsetWidth; t.classList.add("realce");
    },
  };
})();
