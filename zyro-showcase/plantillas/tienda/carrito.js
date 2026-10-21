/* Olmo · estado del carrito. Guarda solo (producto, molienda, modalidad, cantidad); los precios se calculan siempre
   a partir del catálogo, de modo que un dato guardado y manipulado nunca cambia lo que se cobra. */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});
  var CLAVE = "olmo-carrito-v1";
  var lineas = [];
  var oyentes = [];

  function clave(l) { return [l.id, l.molienda, l.modo, l.modo === "suscripcion" ? l.frecuencia : 0].join("|"); }
  function limitar(n) { return Math.max(1, Math.min(O.CONFIG.maxPorLinea, Math.floor(Number(n)) || 1)); }

  function valida(l) {
    return l && O.producto(l.id) && O.moliendaPorId(l.molienda) && (l.modo === "unica" || l.modo === "suscripcion");
  }
  function cargar() {
    var g = O.leer(CLAVE, []);
    if (!Array.isArray(g)) return;
    g.filter(valida).forEach(function (l) {
      var n = { id: l.id, molienda: l.molienda, modo: l.modo, frecuencia: Number(l.frecuencia) || 2, cantidad: limitar(l.cantidad) };
      lineas.push(n);
    });
  }
  function emitir() {
    O.guardar(CLAVE, lineas);
    var r = resumen();
    oyentes.forEach(function (fn) { fn(r); });
  }

  function resumen() {
    var C = O.CONFIG, subtotal = 0, ahorro = 0, unidades = 0;
    var detalle = lineas.map(function (l) {
      var p = O.producto(l.id), unidad = O.precioUnidad(p, l.modo);
      subtotal += unidad * l.cantidad;
      ahorro += (p.precio - unidad) * l.cantidad;
      unidades += l.cantidad;
      return { clave: clave(l), id: l.id, producto: p, molienda: l.molienda, modo: l.modo, frecuencia: l.frecuencia, cantidad: l.cantidad, unidad: unidad, total: unidad * l.cantidad };
    });
    var gratis = subtotal >= C.envioGratisDesde;
    var envio = unidades === 0 || gratis ? 0 : C.gastosEnvio;
    return {
      lineas: detalle, unidades: unidades, subtotal: subtotal, ahorro: ahorro, envio: envio, gratis: gratis && unidades > 0,
      total: subtotal + envio,
      falta: Math.max(0, C.envioGratisDesde - subtotal),
      progreso: Math.min(1, subtotal / C.envioGratisDesde),
    };
  }

  function buscar(k) { for (var i = 0; i < lineas.length; i++) if (clave(lineas[i]) === k) return lineas[i]; return null; }

  O.carrito = {
    resumen: resumen,
    suscribir: function (fn) { oyentes.push(fn); fn(resumen()); },
    agregar: function (nueva) {
      if (!valida(nueva)) return;
      var l = { id: nueva.id, molienda: nueva.molienda, modo: nueva.modo, frecuencia: Number(nueva.frecuencia) || 2, cantidad: limitar(nueva.cantidad || 1) };
      var ya = buscar(clave(l));
      if (ya) ya.cantidad = limitar(ya.cantidad + l.cantidad); else lineas.push(l);
      emitir();
    },
    cantidad: function (k, n) { var l = buscar(k); if (!l) return; if (n < 1) return O.carrito.quitar(k); l.cantidad = limitar(n); emitir(); },
    quitar: function (k) { lineas = lineas.filter(function (l) { return clave(l) !== k; }); emitir(); },
    /* Cambiar la molienda puede coincidir con otra línea igual: entonces se suman */
    moler: function (k, molienda) {
      var l = buscar(k); if (!l || !O.moliendaPorId(molienda)) return;
      l.molienda = molienda;
      var otra = lineas.filter(function (x) { return x !== l && clave(x) === clave(l); })[0];
      if (otra) { otra.cantidad = limitar(otra.cantidad + l.cantidad); lineas = lineas.filter(function (x) { return x !== l; }); }
      emitir();
    },
    vaciar: function () { lineas = []; emitir(); },
  };

  cargar();
})();
