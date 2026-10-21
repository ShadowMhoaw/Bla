/* Olmo · utilidades: formato, almacenamiento, hojas (diálogos) y avisos */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});

  var eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
  O.eur = function (centimos) { return eur.format(centimos / 100); };
  O.norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  O.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  O.$ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  O.$$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  /* localStorage puede fallar (modo privado, bloqueado): nunca debe romper la tienda */
  O.leer = function (clave, defecto) {
    try { var v = localStorage.getItem(clave); return v === null ? defecto : JSON.parse(v); } catch (e) { return defecto; }
  };
  O.guardar = function (clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ } };

  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ── Hojas: <dialog> modal con entrada y salida animadas ── */
  function bloquear() { document.documentElement.classList.toggle("bloqueado", O.$$("dialog.hoja[open]").length > 0); }

  O.abrirHoja = function (d) {
    clearTimeout(d._t);
    if (!d.open) d.showModal();
    bloquear();
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add("visible"); }); });
  };
  O.cerrarHoja = function (d, inmediato) {
    if (!d.open) return;
    d.classList.remove("visible");
    clearTimeout(d._t);
    if (inmediato || sinMovimiento.matches) { d.close(); return; }
    d._t = setTimeout(function () { d.close(); }, 320);
  };
  O.$$("dialog.hoja").forEach(function (d) {
    d.addEventListener("cancel", function (e) { e.preventDefault(); O.cerrarHoja(d); }); // Esc
    d.addEventListener("click", function (e) { if (e.target === d) O.cerrarHoja(d); });   // clic en el fondo
    d.addEventListener("close", bloquear);
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cerrar]");
    if (b) O.cerrarHoja(b.closest("dialog"));
  });

  /* ── Aviso emergente (popover: se pinta por encima de los diálogos) ── */
  var aviso = O.$("#aviso"), tAviso;
  O.aviso = function (texto) {
    if (!aviso) return;
    aviso.textContent = texto;
    try { if (aviso.matches(":popover-open")) aviso.hidePopover(); aviso.showPopover(); } catch (e) { aviso.hidden = false; }
    clearTimeout(tAviso);
    tAviso = setTimeout(function () { try { aviso.hidePopover(); } catch (e) { aviso.hidden = true; } }, 3200);
  };

  /* Imagen que no carga: se oculta y queda el color de fondo de su marco */
  document.addEventListener("error", function (e) { if (e.target.tagName === "IMG") e.target.classList.add("rota"); }, true);
})();
