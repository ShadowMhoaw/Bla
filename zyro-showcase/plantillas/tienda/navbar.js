/* Olmo · cabecera (Navbar): buscador con sugerencias, contador del carrito y botón de cesta */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});
  var $ = O.$, esc = O.esc, eur = O.eur;

  var form = $("#buscador"), input = $("#q"), panel = $("#sugerencias"), borrar = $("#q-borrar");
  var contador = $("#cesta-contador"), abrirCesta = $("#abrir-cesta");
  var items = [], activo = -1, previo = 0;

  /* ── Contador dinámico ── */
  O.carrito.suscribir(function (r) {
    contador.textContent = r.unidades;
    contador.hidden = r.unidades === 0;
    abrirCesta.setAttribute("aria-label", "Abrir la cesta, " + r.unidades + (r.unidades === 1 ? " producto" : " productos"));
    if (r.unidades > previo) { contador.classList.remove("rebote"); void contador.offsetWidth; contador.classList.add("rebote"); }
    previo = r.unidades;
  });
  abrirCesta.addEventListener("click", function () { O.drawer.abrir(); });

  /* ── Buscador ── */
  function cerrarPanel() {
    panel.hidden = true; panel.innerHTML = ""; items = []; activo = -1;
    input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant");
  }
  function marcar(i) {
    activo = i;
    O.$$("[role=option]", panel).forEach(function (o, j) { o.setAttribute("aria-selected", String(j === i)); o.classList.toggle("bg-arena", j === i); });
    if (i >= 0) input.setAttribute("aria-activedescendant", "sug-" + i); else input.removeAttribute("aria-activedescendant");
  }
  function sugerir() {
    var q = input.value.trim();
    borrar.hidden = !q;
    if (!q) { cerrarPanel(); return; }
    var n = O.norm(q);
    items = O.PRODUCTOS.filter(function (p) { return O.norm([p.nombre, p.origen, p.notas.join(" ")].join(" ")).indexOf(n) > -1; }).slice(0, 5);
    panel.hidden = false; input.setAttribute("aria-expanded", "true");
    panel.innerHTML = items.length
      ? items.map(function (p, i) {
        return '<li id="sug-' + i + '" role="option" aria-selected="false" data-id="' + p.id + '" class="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 hover:bg-arena">' +
          '<img src="' + O.img(p.foto, 96) + '" alt="" width="44" height="44" class="size-11 rounded-xl bg-arena object-cover">' +
          '<span class="min-w-0 flex-1"><span class="block truncate text-[15px] font-medium">' + esc(p.nombre) + '</span><span class="block truncate text-xs text-carbon/60">' + esc(p.notas.join(", ")) + "</span></span>" +
          '<span class="text-sm tabular-nums">' + eur(p.precio) + "</span></li>";
      }).join("")
      : '<li class="px-3 py-3 text-sm text-carbon/60">Ningún café coincide con «' + esc(q) + "». Pruebe con un origen o una nota de cata.</li>";
    activo = -1;
  }
  function elegir(id) { cerrarPanel(); input.blur(); O.productos.ir(id); }

  input.addEventListener("input", sugerir);
  input.addEventListener("focus", sugerir);
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" && items.length) { e.preventDefault(); marcar((activo + 1) % items.length); }
    else if (e.key === "ArrowUp" && items.length) { e.preventDefault(); marcar((activo - 1 + items.length) % items.length); }
    else if (e.key === "Escape") { if (!panel.hidden) cerrarPanel(); else { input.value = ""; borrar.hidden = true; O.productos.buscar(""); input.blur(); } }
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (activo >= 0 && items[activo]) return elegir(items[activo].id);
    var q = input.value.trim();
    cerrarPanel(); input.blur();
    O.productos.buscar(q);
    $("#cafes").scrollIntoView({ behavior: "smooth" });
  });
  /* mousedown y no click: el clic en una sugerencia no debe provocar antes el blur del campo */
  panel.addEventListener("mousedown", function (e) { e.preventDefault(); });
  panel.addEventListener("click", function (e) { var o = e.target.closest("[data-id]"); if (o) elegir(o.dataset.id); });
  borrar.addEventListener("click", function () { O.navbar.limpiarBusqueda(); O.productos.buscar(""); input.focus(); });
  document.addEventListener("click", function (e) { if (!form.contains(e.target)) cerrarPanel(); });

  O.navbar = {
    limpiarBusqueda: function () { input.value = ""; borrar.hidden = true; cerrarPanel(); },
  };
})();
