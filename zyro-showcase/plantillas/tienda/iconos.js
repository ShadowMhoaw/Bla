/* Olmo · iconos de línea (trazo 1.6, 24×24). Todos decorativos: el botón que los contiene lleva su aria-label. */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});
  function svg(d, extra) {
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' + (extra || "") + ">" + d + "</svg>";
  }
  O.iconos = {
    lupa: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
    usuario: svg('<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'),
    bolsa: svg('<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
    x: svg('<path d="m6 6 12 12M18 6 6 18"/>'),
    mas: svg('<path d="M12 5v14M5 12h14"/>'),
    menos: svg('<path d="M5 12h14"/>'),
    papelera: svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5"/>'),
    check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    camion: svg('<path d="M3 6.5h11v10H3zM14 10h3.8l2.7 3v3.5H14"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  };
  /* Logotipo: cuadrado oscuro con un grano de café ámbar */
  O.logo = '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="10" fill="#1A1A1A"/><path d="M20 8c5.2 3.1 7.6 7.4 7.6 12S25.2 28.9 20 32c-5.2-3.1-7.6-7.4-7.6-12S14.800 11.100 20 8Z" fill="#D9A36E"/><path d="M20 10.500c-2.200 3.300-1.500 6 .1 9s1.800 5.800-.1 9.500" fill="none" stroke="#1A1A1A" stroke-width="1.900" stroke-linecap="round"/></svg>';

  /* Los scripts van al final del <body>: el DOM ya está listo. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-icono]"), function (el) { el.innerHTML = O.iconos[el.dataset.icono] || ""; });
  Array.prototype.forEach.call(document.querySelectorAll("[data-logo]"), function (el) { el.innerHTML = O.logo; });
})();
