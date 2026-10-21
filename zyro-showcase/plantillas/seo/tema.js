/* Aplica el tema guardado (o el del sistema) antes de pintar, para que no haya parpadeo.
   Va en un archivo aparte, y no en línea, para no depender de una política CSP permisiva. */
(function () {
  var tema = "light";
  try {
    tema = localStorage.getItem("zyro-tema") ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) { /* almacenamiento bloqueado: se queda el tema claro */ }
  document.documentElement.dataset.tema = tema;
})();
