/* Gráficos en SVG sin dependencias: sparklines para los KPI y el gráfico de evolución interactivo.
   Los colores salen de variables CSS, así que el cambio de tema no obliga a redibujar nada. */
(function () {
  "use strict";

  /* ---------- Sparkline ---------- */
  // valores: serie corta; invertido: true cuando un número menor es mejor (la posición en Google)
  function sparkline(valores, o) {
    var w = 96, h = 32, p = 3;
    var min = Math.min.apply(null, valores), max = Math.max.apply(null, valores), rango = max - min || 1;
    var pts = valores.map(function (v, i) {
      var t = (v - min) / rango;
      if (o.invertido) t = 1 - t;
      return [p + (w - 2 * p) * i / (valores.length - 1), h - p - (h - 2 * p) * t];
    });
    var d = pts.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" ");
    var ult = pts[pts.length - 1];
    var area = d + " L" + ult[0].toFixed(1) + " " + h + " L" + pts[0][0].toFixed(1) + " " + h + " Z";
    var color = o.malo ? "var(--rojo)" : "var(--acento)";
    return '<svg class="spark" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + o.id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" style="stop-color:' + color + ';stop-opacity:.25"/><stop offset="1" style="stop-color:' + color + ';stop-opacity:0"/></linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#' + o.id + ')"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + ult[0].toFixed(1) + '" cy="' + ult[1].toFixed(1) + '" r="2.5" fill="' + color + '"/></svg>';
  }

  /* ---------- Ejes ---------- */
  // Marcas «redondas» para el eje vertical (0, 100, 200…) con un poco de aire por arriba
  function marcas(max, n) {
    var bruto = max * 1.05 / n;
    var base = Math.pow(10, Math.floor(Math.log10(bruto)));
    var f = bruto / base;
    var paso = (f >= 7.5 ? 10 : f >= 3.5 ? 5 : f >= 1.5 ? 2 : 1) * base;
    var tope = Math.ceil(max * 1.05 / paso) * paso, res = [];
    for (var v = 0; v <= tope + paso / 1000; v += paso) res.push(Math.round(v * 1000) / 1000);
    return res;
  }

  /* ---------- Gráfico de evolución ----------
     cfg: { etiquetas, etiquetasLargas, series:{clave:[...]}, metricas:{clave:{nombre, fmt, fmtEje, marcas?}}, activo:int } */
  function evolucion(caja, cfg) {
    var estado = { metrica: "clics", activo: cfg.activo, hover: null };
    var geo = null;

    caja.innerHTML = '<div class="evo-svg"></div><div class="evo-tip" aria-hidden="true"></div>';
    var lienzo = caja.firstChild, tip = caja.lastChild;

    function dibujar() {
      var m = cfg.metricas[estado.metrica], v = cfg.series[estado.metrica], n = v.length;
      var W = Math.max(caja.clientWidth, 300), estrecho = W < 560, H = estrecho ? 230 : 290;
      var izq = estrecho ? 42 : 56, der = 14, arr = 14, aba = 32;
      var ejes = m.marcas || marcas(Math.max.apply(null, v), 4);
      var d0 = ejes[0], d1 = ejes[ejes.length - 1];
      var X = function (i) { return izq + (W - izq - der) * i / (n - 1); };
      var Y = function (x) { return H - aba - (H - aba - arr) * (x - d0) / (d1 - d0); };
      geo = { W: W, H: H, X: X, Y: Y, izq: izq, der: der, n: n };

      var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true" focusable="false">' +
        '<defs><linearGradient id="g-evo" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" style="stop-color:var(--acento);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--acento);stop-opacity:0"/></linearGradient></defs>';

      ejes.forEach(function (t) {
        s += '<line class="rej" x1="' + izq + '" x2="' + (W - der) + '" y1="' + Y(t).toFixed(1) + '" y2="' + Y(t).toFixed(1) + '"/>' +
          '<text class="eje" x="' + (izq - 10) + '" y="' + (Y(t) + 4).toFixed(1) + '" text-anchor="end">' + m.fmtEje(t) + "</text>";
      });

      var pts = v.map(function (x, i) { return X(i).toFixed(1) + " " + Y(x).toFixed(1); });
      s += '<path class="area" d="M' + X(0).toFixed(1) + " " + (H - aba) + " L" + pts.join(" L") + " L" + X(n - 1).toFixed(1) + " " + (H - aba) + ' Z"/>' +
        '<path class="linea" d="M' + pts.join(" L") + '"/>';

      v.forEach(function (x, i) {
        s += '<circle class="pto" cx="' + X(i).toFixed(1) + '" cy="' + Y(x).toFixed(1) + '" r="3"/>';
        if (estrecho && (n - 1 - i) % 2) return;
        s += '<text class="eje' + (i === estado.activo ? " eje-act" : "") + '" x="' + X(i).toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle">' + cfg.etiquetas[i] + "</text>";
      });

      // Mes del informe: guía discreta y punto destacado
      var ax = X(estado.activo).toFixed(1), ay = Y(v[estado.activo]).toFixed(1);
      s += '<line class="guia-act" x1="' + ax + '" x2="' + ax + '" y1="' + ay + '" y2="' + (H - aba) + '"/>' +
        '<circle class="pto-act-aro" cx="' + ax + '" cy="' + ay + '" r="9"/><circle class="pto-act" cx="' + ax + '" cy="' + ay + '" r="5"/>';

      // Elementos que sigue el cursor
      s += '<line class="guia-hov" x1="0" x2="0" y1="' + arr + '" y2="' + (H - aba) + '" visibility="hidden"/>' +
        '<circle class="pto-hov" cx="0" cy="0" r="5" visibility="hidden"/></svg>';

      lienzo.innerHTML = s;
      mostrar(estado.hover);
    }

    function delta(clave, i) {
      if (i === 0) return "";
      var a = cfg.series[clave][i], b = cfg.series[clave][i - 1];
      if (clave === "ctr") { var dp = a - b; return (dp >= 0 ? "+" : "−") + Math.abs(dp).toFixed(2).replace(".", ",") + " pts"; }
      var p = Math.round((a / b - 1) * 100);
      return (p >= 0 ? "+" : "−") + Math.abs(p) + " %";
    }

    function mostrar(i) {
      estado.hover = i;
      var g = lienzo.querySelector(".guia-hov"), p = lienzo.querySelector(".pto-hov");
      if (i == null || !geo) {
        if (g) { g.setAttribute("visibility", "hidden"); p.setAttribute("visibility", "hidden"); }
        tip.classList.remove("ver");
        return;
      }
      var val = cfg.series[estado.metrica][i];
      var x = geo.X(i), y = geo.Y(val);
      g.setAttribute("x1", x); g.setAttribute("x2", x); g.setAttribute("visibility", "visible");
      p.setAttribute("cx", x); p.setAttribute("cy", y); p.setAttribute("visibility", "visible");

      var filas = Object.keys(cfg.metricas).map(function (k) {
        return '<div class="fila' + (k === estado.metrica ? " act" : "") + '"><span>' + cfg.metricas[k].nombre + "</span><b>" +
          cfg.metricas[k].fmtTip(cfg.series[k][i]) + "</b></div>";
      }).join("");
      var dl = delta(estado.metrica, i);
      tip.innerHTML = '<div class="mes">' + cfg.etiquetasLargas[i] + "</div>" + filas +
        (dl ? '<div class="var ' + (dl.charAt(0) === "+" ? "ok" : "mal") + '">' + dl + " frente al mes anterior</div>" : "");
      tip.classList.add("ver");

      var ancho = tip.offsetWidth, alto = tip.offsetHeight;
      var izq = Math.min(Math.max(x - ancho / 2, 0), geo.W - ancho);
      var arriba = y - alto - 14;
      tip.style.left = izq + "px";
      tip.style.top = (arriba < 0 ? y + 16 : arriba) + "px";
    }

    function indiceDesdeEvento(e) {
      var r = lienzo.getBoundingClientRect();
      var x = (e.clientX - r.left) * (geo.W / r.width);
      var i = Math.round((x - geo.izq) / (geo.W - geo.izq - geo.der) * (geo.n - 1));
      return Math.min(Math.max(i, 0), geo.n - 1);
    }

    lienzo.addEventListener("pointermove", function (e) { mostrar(indiceDesdeEvento(e)); });
    lienzo.addEventListener("pointerdown", function (e) { mostrar(indiceDesdeEvento(e)); });
    lienzo.addEventListener("pointerleave", function () { if (document.activeElement !== caja) mostrar(null); });

    // Teclado: flechas para recorrer los meses
    caja.addEventListener("keydown", function (e) {
      var n = geo.n, i = estado.hover == null ? estado.activo : estado.hover, nuevo = null;
      if (e.key === "ArrowRight") nuevo = Math.min(i + 1, n - 1);
      else if (e.key === "ArrowLeft") nuevo = Math.max(i - 1, 0);
      else if (e.key === "Home") nuevo = 0;
      else if (e.key === "End") nuevo = n - 1;
      else if (e.key === "Escape") { mostrar(null); return; }
      if (nuevo == null) return;
      e.preventDefault();
      mostrar(nuevo);
    });
    caja.addEventListener("blur", function () { mostrar(null); });

    dibujar();

    return {
      metrica: function (k) { estado.metrica = k; dibujar(); },
      activo: function (i) { estado.activo = i; dibujar(); },
      redibujar: dibujar
    };
  }

  window.Graficos = { sparkline: sparkline, evolucion: evolucion };
})();
