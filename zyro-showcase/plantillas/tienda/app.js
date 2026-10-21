/* Olmo · arranque: ensambla los módulos y cablea lo que no es de ninguno */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});
  var $ = O.$;

  O.productos.pintar();

  // «Packs de degustación» filtra el catálogo y baja hasta él
  O.$$("[data-ir-filtro]").forEach(function (a) {
    a.addEventListener("click", function () { O.productos.filtrar(a.dataset.irFiltro); });
  });
  O.$$("[data-abrir-cesta]").forEach(function (b) { b.addEventListener("click", function () { O.drawer.abrir(); }); });
  var seguir = $("#cesta-vacia-ver");
  if (seguir) seguir.addEventListener("click", function () { O.drawer.cerrar(); $("#cafes").scrollIntoView({ behavior: "smooth" }); });

  // Próximo día de tueste (lunes): si hoy es lunes, hoy
  var hoy = new Date(), dias = (8 - hoy.getDay()) % 7;
  var lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + dias);
  var fecha = lunes.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  $("#proximo-tueste").textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  $("#anio").textContent = hoy.getFullYear();
})();
