/* Gráficos en SVG sin dependencias: sparklines para los KPI y el gráfico de evolución interactivo.
   Los colores salen de variables CSS, así que el cambio de tema no obliga a redibujar nada.
   El movimiento (trazado inicial, cambio de métrica, desplazamiento del mes activo) usa una curva de
   frenado suave y se desactiva por completo con «reducir movimiento». */
(function () {
  "use strict";

  var reducido = function () { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); };

  /* ---------- Animación ---------- */
  var frenar = function (t) { return 1 - Math.pow(1 - t, 4); }; // empieza rápido y se posa despacio

  // Llama a paso(0..1) durante «dur» ms. Devuelve un objeto para cancelarla.
  function animar(dur, paso, fin) {
    if (reducido()) { paso(1); if (fin) fin(); return { cancelar: function () {} }; }
    var ini = performance.now(), id = 0, viva = true;
    (function cuadro(ahora) {
      if (!viva) return;
      var t = Math.min((ahora - ini) / dur, 1);
      paso(frenar(t));
      if (t < 1) id = requestAnimationFrame(cuadro); else if (fin) fin();
    })(ini);
    return { cancelar: function () { viva = false; cancelAnimationFrame(id); } };
  }

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
      '<path class="spark-area" d="' + area + '" fill="url(#' + o.id + ')"/>' +
      '<path class="spark-linea" pathLength="1" d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle class="spark-punto" cx="' + ult[0].toFixed(1) + '" cy="' + ult[1].toFixed(1) + '" r="2.5" fill="' + color + '"/></svg>';
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
     cfg: { etiquetas, etiquetasLargas, series:{clave:[...]}, metricas:{clave:{nombre, fmtEje, fmtTip, marcas?}}, activo:int }
     El SVG se monta una vez por métrica y por ancho; mientras dura una animación solo se mueven la línea, los puntos y el marcador. */
  function evolucion(caja, cfg) {
    var est = { metrica: "clics", activo: cfg.activo, pos: cfg.activo, fr: null, hover: null, anim: null };
    var geo = null, E = {};

    caja.innerHTML = '<div class="evo-svg"></div><div class="evo-tip" aria-hidden="true"></div>';
    var lienzo = caja.firstChild, tip = caja.lastChild;

    // Fracción (0 a 1) de cada valor dentro del eje de su métrica
    function fracciones(clave) {
      var m = cfg.metricas[clave], v = cfg.series[clave];
      var ejes = m.marcas || marcas(Math.max.apply(null, v), 4);
      var d0 = ejes[0], d1 = ejes[ejes.length - 1];
      return { ejes: ejes, fr: v.map(function (x) { return (x - d0) / (d1 - d0); }) };
    }

    function armar(frInicial, entrada, ejesNuevos) {
      var m = cfg.metricas[est.metrica], n = cfg.series[est.metrica].length;
      var W = Math.max(caja.clientWidth, 300), estrecho = W < 560, H = estrecho ? 230 : 290;
      var izq = estrecho ? 42 : 56, der = 14, arr = 14, aba = 32;
      var f = fracciones(est.metrica);
      geo = {
        W: W, H: H, n: n, izq: izq, der: der, aba: aba, ejes: f.ejes, destino: f.fr,
        X: function (i) { return izq + (W - izq - der) * i / (n - 1); },
        Yf: function (fr) { return H - aba - (H - aba - arr) * fr; }
      };

      var s = '<svg class="' + (entrada ? "dibuja" : "") + '" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true" focusable="false">' +
        '<defs><linearGradient id="g-evo" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" style="stop-color:var(--acento);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--acento);stop-opacity:0"/></linearGradient></defs>';

      s += '<g class="ejes' + (ejesNuevos ? " ejes-nuevo" : "") + '">';
      f.ejes.forEach(function (t, j) {
        var fr = (t - f.ejes[0]) / (f.ejes[f.ejes.length - 1] - f.ejes[0]), y = geo.Yf(fr).toFixed(1);
        s += '<line class="rej" x1="' + izq + '" x2="' + (W - der) + '" y1="' + y + '" y2="' + y + '"/>' +
          '<text class="eje" x="' + (izq - 10) + '" y="' + (geo.Yf(fr) + 4).toFixed(1) + '" text-anchor="end">' + m.fmtEje(t) + "</text>";
      });
      s += "</g>";

      s += '<g class="meses">';
      cfg.etiquetas.forEach(function (e, i) {
        if (estrecho && (n - 1 - i) % 2) return;
        s += '<text class="eje mes-x" data-i="' + i + '" x="' + geo.X(i).toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle">' + e + "</text>";
      });
      s += "</g>";

      s += '<path class="area" d=""/><path class="linea" pathLength="1" d=""/><g class="puntos">';
      for (var i = 0; i < n; i++) s += '<circle class="pto" style="--i:' + i + '" cx="' + geo.X(i).toFixed(1) + '" cy="0" r="3"/>';
      s += '</g><line class="guia-act" x1="0" x2="0" y1="0" y2="0"/><circle class="pto-act-aro" r="9" cx="0" cy="0"/><circle class="pto-act" r="5" cx="0" cy="0"/>' +
        '<line class="guia-hov" x1="0" x2="0" y1="' + arr + '" y2="' + (H - aba) + '" visibility="hidden"/><circle class="pto-hov" r="5" cx="0" cy="0" visibility="hidden"/></svg>';

      lienzo.innerHTML = s;
      E = {
        area: lienzo.querySelector(".area"), linea: lienzo.querySelector(".linea"), pts: lienzo.querySelectorAll(".pto"),
        gAct: lienzo.querySelector(".guia-act"), aro: lienzo.querySelector(".pto-act-aro"), act: lienzo.querySelector(".pto-act"),
        gHov: lienzo.querySelector(".guia-hov"), pHov: lienzo.querySelector(".pto-hov"), meses: lienzo.querySelectorAll(".mes-x")
      };
      actualizar(frInicial || f.fr, est.pos);
      mostrar(est.hover);
    }

    // Coloca línea, puntos y marcador del mes según las fracciones y la posición (puede ser fraccionaria)
    function actualizar(fr, pos) {
      var n = geo.n, ys = fr.map(geo.Yf);
      var pts = ys.map(function (y, i) { return geo.X(i).toFixed(1) + " " + y.toFixed(1); });
      var base = geo.H - geo.aba;
      E.linea.setAttribute("d", "M" + pts.join(" L"));
      E.area.setAttribute("d", "M" + geo.X(0).toFixed(1) + " " + base + " L" + pts.join(" L") + " L" + geo.X(n - 1).toFixed(1) + " " + base + " Z");
      for (var i = 0; i < n; i++) E.pts[i].setAttribute("cy", ys[i].toFixed(1));

      var i0 = Math.min(Math.floor(pos), n - 1), i1 = Math.min(i0 + 1, n - 1), k = pos - i0;
      var ax = geo.X(pos).toFixed(1), ay = (ys[i0] + (ys[i1] - ys[i0]) * k).toFixed(1);
      E.gAct.setAttribute("x1", ax); E.gAct.setAttribute("x2", ax); E.gAct.setAttribute("y1", ay); E.gAct.setAttribute("y2", base);
      E.aro.setAttribute("cx", ax); E.aro.setAttribute("cy", ay); E.act.setAttribute("cx", ax); E.act.setAttribute("cy", ay);

      var cerca = Math.round(pos);
      Array.prototype.forEach.call(E.meses, function (t) { t.classList.toggle("eje-act", +t.dataset.i === cerca); });
      est.fr = fr; est.pos = pos;
      if (est.hover != null) moverHover(est.hover);
    }

    function delta(clave, i) {
      if (i === 0) return "";
      var a = cfg.series[clave][i], b = cfg.series[clave][i - 1];
      if (clave === "ctr") { var dp = a - b; return (dp >= 0 ? "+" : "−") + Math.abs(dp).toFixed(2).replace(".", ",") + " pts"; }
      var p = Math.round((a / b - 1) * 100);
      return (p >= 0 ? "+" : "−") + Math.abs(p) + " %";
    }

    function moverHover(i) {
      var x = geo.X(i), y = geo.Yf(est.fr[i]);
      E.gHov.setAttribute("x1", x); E.gHov.setAttribute("x2", x); E.gHov.setAttribute("visibility", "visible");
      E.pHov.setAttribute("cx", x); E.pHov.setAttribute("cy", y); E.pHov.setAttribute("visibility", "visible");
    }

    function mostrar(i) {
      est.hover = i;
      if (i == null || !geo) {
        if (E.gHov) { E.gHov.setAttribute("visibility", "hidden"); E.pHov.setAttribute("visibility", "hidden"); }
        tip.classList.remove("ver");
        return;
      }
      moverHover(i);
      var x = geo.X(i), y = geo.Yf(est.fr[i]);
      var filas = Object.keys(cfg.metricas).map(function (k) {
        return '<div class="fila' + (k === est.metrica ? " act" : "") + '"><span>' + cfg.metricas[k].nombre + "</span><b>" + cfg.metricas[k].fmtTip(cfg.series[k][i]) + "</b></div>";
      }).join("");
      var dl = delta(est.metrica, i);
      tip.innerHTML = '<div class="mes">' + cfg.etiquetasLargas[i] + "</div>" + filas +
        (dl ? '<div class="var ' + (dl.charAt(0) === "+" ? "ok" : "mal") + '">Frente al mes anterior: ' + dl + "</div>" : "");

      var ancho = tip.offsetWidth, alto = tip.offsetHeight;
      var izq = Math.min(Math.max(x - ancho / 2, 0), geo.W - ancho);
      var arriba = y - alto - 14;
      var estaba = tip.classList.contains("ver");
      if (!estaba) tip.style.transition = "opacity .2s, transform .35s"; // la primera vez aparece en su sitio, sin deslizarse desde la esquina
      tip.style.left = izq + "px";
      tip.style.top = (arriba < 0 ? y + 16 : arriba) + "px";
      tip.style.transformOrigin = arriba < 0 ? "top center" : "bottom center";
      if (!estaba) { void tip.offsetWidth; tip.style.transition = ""; }
      tip.classList.add("ver");
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
      var n = geo.n, i = est.hover == null ? est.activo : est.hover, nuevo = null;
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

    function cancelar() { if (est.anim) est.anim.cancelar(); est.anim = null; }

    armar(null, true, false);

    return {
      // Al cambiar de métrica, la línea se transforma en la nueva en lugar de saltar
      metrica: function (k) {
        cancelar();
        var antes = est.fr.slice(), pos = est.pos;
        est.metrica = k;
        armar(antes, false, true);
        var destino = geo.destino;
        est.anim = animar(750, function (t) {
          actualizar(antes.map(function (a, j) { return a + (destino[j] - a) * t; }), pos);
        });
      },
      // Al cambiar de mes, el marcador se desliza hasta él
      activo: function (i) {
        cancelar();
        est.activo = i;
        var p0 = est.pos, fr = est.fr;
        est.anim = animar(700, function (t) { actualizar(fr, p0 + (i - p0) * t); });
      },
      redibujar: function () { cancelar(); armar(est.fr, false, false); }
    };
  }

  window.Graficos = { sparkline: sparkline, evolucion: evolucion, animar: animar, reducido: reducido };
})();
