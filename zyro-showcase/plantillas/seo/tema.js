/* Aplica la preferencia de tema guardada antes de pintar, para que no haya parpadeo.
   Sin preferencia guardada no se toca nada: el CSS sigue al sistema (prefers-color-scheme).
   Va en un archivo aparte, y no en línea, para no depender de una política CSP permisiva. */
(function () {
  try {
    var t = localStorage.getItem("zyro-tema");
    if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
  } catch (e) { /* almacenamiento bloqueado: se queda el tema del sistema */ }
})();
