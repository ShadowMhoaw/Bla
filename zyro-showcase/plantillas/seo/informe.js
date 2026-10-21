/* Informe mensual de SEO: pinta el panel a partir de window.INFORME.
   Estructura: utilidades · KPI · resumen · evolución · tablas · mantenimiento · acciones · cabecera. */
(function () {
  "use strict";

  var D = window.INFORME, S = D.serie, ico = window.icono, G = window.Graficos;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Utilidades ---------- */
  var nf = new Intl.NumberFormat("es-ES");
  var N = function (n) { return nf.format(n); };
  var dec = function (n, d) { return Number(n).toFixed(d).replace(".", ","); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var plano = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var suma = function (a, f) { return a.reduce(function (t, x) { return t + f(x); }, 0); };

  S.ctr = S.clics.map(function (c, i) { return c / S.impresiones[i] * 100; });

  var estado = { mes: "septiembre", evo: null };
  var tablas = {
    busq: { q: "", campo: "clics", dir: "desc" },
    pag: { q: "", campo: "clics", dir: "desc" }
  };

  var esOportunidad = function (p) { return p > 10 && p <= D.oportunidadMax; };
  var claseTop = function (p) { return p <= 3 ? "b-verde" : p <= 10 ? "b-azul" : "b-gris"; };
  var badgePos = function (p) { return '<span class="badge ' + claseTop(p) + '">' + dec(p, 1) + "</span>"; };

  /* ---------- KPI ---------- */
  var KPIS = [
    { id: "clics", nombre: "Clics desde Google", icono: "mouse", fmt: N,
      ayuda: "Las veces que alguien vio tu web en Google y entró en ella. Son visitas reales." },
    { id: "impresiones", nombre: "Impresiones", icono: "eye", fmt: N,
      ayuda: "Las veces que tu web apareció en los resultados de Google, aunque nadie llegara a pulsar." },
    { id: "posicion", nombre: "Posición media", icono: "target", fmt: function (v) { return dec(v, 1); }, invertido: true,
      ayuda: "El puesto medio en el que sales en Google. Cuanto más bajo el número, mejor: el 1 es el primer resultado." },
    { id: "solicitudes", nombre: "Solicitudes de presupuesto", icono: "file-text", fmt: String,
      ayuda: "Personas que han pedido presupuesto desde la web. Son clientes potenciales." }
  ];

  function pintarKpis(i) {
    var mesAnterior = D.etiquetasLargas[i - 1].split(" ")[0];
    $("kpis").innerHTML = KPIS.map(function (k) {
      var v = S[k.id], act = v[i], prev = v[i - 1], mejor, texto;
      if (k.id === "posicion") { mejor = prev - act >= 0; texto = dec(Math.abs(prev - act), 1) + " puestos"; }
      else if (k.id === "solicitudes") { mejor = act >= prev; texto = (act >= prev ? "+" : "−") + Math.abs(act - prev); }
      else { var p = Math.round((act / prev - 1) * 100); mejor = p >= 0; texto = (p >= 0 ? "+" : "−") + Math.abs(p) + " %"; }
      var serie = v.slice(Math.max(0, i - 5), i + 1);
      return '<article class="kpi">' +
        '<div class="kpi-cab"><span class="kpi-ico">' + ico(k.icono, 18) + "</span>" +
        '<span class="kpi-nombre">' + k.nombre + "</span>" +
        '<button type="button" class="info" aria-describedby="ayuda-' + k.id + '" aria-label="¿Qué significa «' + k.nombre + '»?">' + ico("info", 16) + "</button>" +
        '<span class="ayuda" role="tooltip" id="ayuda-' + k.id + '">' + k.ayuda + "</span></div>" +
        '<div class="kpi-valor">' + k.fmt(act) + "</div>" +
        '<div class="kpi-pie"><div><span class="delta ' + (mejor ? "ok" : "mal") + '">' +
        ico(mejor ? "arrow-up" : "arrow-down", 13) + texto + '</span><span class="vs">frente a ' + mesAnterior.toLowerCase() + "</span></div>" +
        G.sparkline(serie, { id: "sp-" + k.id, invertido: k.invertido, malo: !mejor }) + "</div></article>";
    }).join("");
  }

  /* ---------- Resumen del mes (insight) ----------
     Aquí se compone con plantillas a partir de los datos. En producción este texto vendría de una API o de un modelo de lenguaje. */
  function pintarInsight(i, info) {
    var dPos = S.posicion[i - 1] - S.posicion[i];
    var top = info.paginas.slice().sort(function (a, b) { return b.clics - a.clics; })[0];
    var cuota = Math.round(top.clics / S.clics[i] * 100);
    var op = info.busquedas.filter(function (b) { return esOportunidad(b.pos); }).sort(function (a, b) { return a.pos - b.pos; })[0];

    var t = (dPos >= 0 ? "Este mes has mejorado tu posición media en <strong>" : "Este mes tu posición media ha empeorado en <strong>") +
      dec(Math.abs(dPos), 1) + " puestos</strong>, hasta el <strong>" + dec(S.posicion[i], 1) + "</strong>. " +
      "La página <strong>«" + esc(top.titulo) + "»</strong> atrae el <strong>" + cuota + " %</strong> de los clics" +
      (op ? ", y «" + esc(op.q) + "» está en la posición " + dec(op.pos, 1) + ", a un paso del Top 10." : ".");

    $("insight").innerHTML =
      '<div class="insight-cab"><span class="insight-ico">' + ico("sparkles", 18) + "</span>" +
      '<h2 id="insight-titulo">Resumen de ' + info.nombre.toLowerCase() + '</h2><span class="etiqueta-ia">Resumen automático</span></div>' +
      '<p class="insight-texto">' + t + "</p>" +
      '<div class="sugerencia">' + ico("lightbulb", 18) + "<p><strong>Sugerencia.</strong> " + esc(info.sugerencia) + "</p></div>";
  }

  /* ---------- Evolución ---------- */
  function crearEvolucion(i) {
    var pctFmt = function (v, d) { return dec(v, d) + " %"; };
    estado.evo = G.evolucion($("evo"), {
      etiquetas: D.etiquetas, etiquetasLargas: D.etiquetasLargas, activo: i,
      series: { clics: S.clics, impresiones: S.impresiones, ctr: S.ctr },
      metricas: {
        clics: { nombre: "Clics", fmtEje: N, fmtTip: N },
        impresiones: {
          nombre: "Impresiones", fmtTip: N,
          fmtEje: function (v) { return v >= 1000 ? (v / 1000) + " k" : String(v); }
        },
        ctr: {
          nombre: "CTR", marcas: [1.5, 2, 2.5, 3],
          fmtEje: function (v) { return pctFmt(v, 1); }, fmtTip: function (v) { return pctFmt(v, 2); }
        }
      }
    });

    var textos = {
      clics: "Visitas que llegan desde Google cada mes",
      impresiones: "Veces que tu web aparece en los resultados de Google",
      ctr: "De cada 100 veces que apareces, cuántas personas entran"
    };
    var nombres = { clics: "Clics", impresiones: "Impresiones", ctr: "CTR" };
    var actual = "clics";
    var pintarSeg = function () {
      $("metricas").innerHTML = Object.keys(nombres).map(function (k) {
        return '<button type="button" data-metrica="' + k + '" aria-pressed="' + (k === actual) + '">' + nombres[k] + "</button>";
      }).join("");
      $("evo-sub").textContent = textos[actual];
    };
    pintarSeg();
    $("metricas").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-metrica]");
      if (!b) return;
      actual = b.dataset.metrica;
      estado.evo.metrica(actual);
      pintarSeg();
    });

    // Tabla equivalente para lectores de pantalla
    $("evo-tabla").innerHTML = "<caption>Clics, impresiones y CTR de los últimos 12 meses</caption>" +
      "<thead><tr><th>Mes</th><th>Clics</th><th>Impresiones</th><th>CTR</th></tr></thead><tbody>" +
      D.etiquetasLargas.map(function (m, j) {
        return "<tr><td>" + m + "</td><td>" + N(S.clics[j]) + "</td><td>" + N(S.impresiones[j]) + "</td><td>" + pctFmt(S.ctr[j], 2) + "</td></tr>";
      }).join("") + "</tbody>";
  }

  /* ---------- Tablas ---------- */
  function ordenar(lista, t) {
    var f = t.dir === "asc" ? 1 : -1;
    return lista.slice().sort(function (a, b) { return (a[t.campo] - b[t.campo]) * f || b.clics - a.clics; });
  }

  function cabecera(t, columnas) {
    return "<thead><tr>" + columnas.map(function (c) {
      if (!c.campo) return '<th scope="col"' + (c.num ? ' class="num"' : "") + ">" + c.texto + "</th>";
      var activa = t.campo === c.campo;
      var sentido = activa ? (t.dir === "asc" ? "ascending" : "descending") : "none";
      var flecha = activa ? ico(t.dir === "asc" ? "chevron-up" : "chevron-down", 14) : ico("arrow-up-down", 13);
      return '<th scope="col" class="num" aria-sort="' + sentido + '"><button type="button" class="orden' + (activa ? " activa" : "") +
        '" data-campo="' + c.campo + '">' + c.texto + flecha + "</button></th>";
    }).join("") + "</tr></thead>";
  }

  function cambio(m) {
    return m > 0 ? '<span class="cambio ok">' + ico("arrow-up", 13) + dec(m, 1) + "</span>" : '<span class="cambio igual">—</span>';
  }

  function pintarBusquedas(i, info) {
    var t = tablas.busq, q = plano(t.q.trim());
    var filas = ordenar(info.busquedas.filter(function (b) { return !q || plano(b.q).indexOf(q) > -1; }), t);
    var cuerpo = filas.map(function (b) {
      var aviso = esOportunidad(b.pos)
        ? '<span class="oportunidad">' + ico("triangle-alert", 13) + "Cerca del Top 10</span>" : "";
      return '<tr><td><span class="kw">' + esc(b.q) + "</span>" + aviso + '</td><td class="num">' + b.clics +
        '</td><td class="num">' + badgePos(b.pos) + '</td><td class="num">' + cambio(b.mejora) + "</td></tr>";
    }).join("") || '<tr><td colspan="4" class="vacio">Ninguna búsqueda coincide con «' + esc(t.q.trim()) + "».</td></tr>";

    $("t-busq").innerHTML = "<caption class=\"solo-lectores\">Búsquedas que traen visitas, ordenables por clics y posición</caption>" +
      cabecera(t, [{ texto: "Palabra clave" }, { texto: "Clics", campo: "clics", num: 1 }, { texto: "Posición", campo: "pos", num: 1 }, { texto: "Cambio", num: 1 }]) +
      "<tbody>" + cuerpo + "</tbody>";
    var otras = S.clics[i] - suma(info.busquedas, function (b) { return b.clics; });
    $("pie-busq").textContent = "Mostrando " + filas.length + " de " + info.busquedas.length + " búsquedas · " + otras + " clics más vienen de búsquedas poco frecuentes";
  }

  function pintarPaginas(i, info) {
    var t = tablas.pag, q = plano(t.q.trim());
    var filas = ordenar(info.paginas.filter(function (p) { return !q || plano(p.url + " " + p.titulo).indexOf(q) > -1; }), t);
    var cuerpo = filas.map(function (p) {
      return '<tr><td><span class="kw">' + esc(p.titulo) + '</span><span class="url">' + esc(p.url) + '</span></td><td class="num">' + p.clics +
        '</td><td class="num">' + badgePos(p.pos) + '</td><td class="num">' + Math.round(p.clics / S.clics[i] * 100) + " %</td></tr>";
    }).join("") || '<tr><td colspan="4" class="vacio">Ninguna página coincide con «' + esc(t.q.trim()) + "».</td></tr>";

    $("t-pag").innerHTML = "<caption class=\"solo-lectores\">Páginas con más visitas, ordenables por clics y posición</caption>" +
      cabecera(t, [{ texto: "Página" }, { texto: "Clics", campo: "clics", num: 1 }, { texto: "Posición", campo: "pos", num: 1 }, { texto: "Tráfico", num: 1 }]) +
      "<tbody>" + cuerpo + "</tbody>";
    var otras = S.clics[i] - suma(info.paginas, function (p) { return p.clics; });
    $("pie-pag").textContent = "Mostrando " + filas.length + " de " + info.paginas.length + " páginas · " + otras + " clics más van a otras páginas";
  }

  function conectarTabla(clave, idBuscador, idTabla, repintar) {
    $(idBuscador).addEventListener("input", function (e) { tablas[clave].q = e.target.value; repintar(); });
    $(idTabla).addEventListener("click", function (e) {
      var b = e.target.closest("button[data-campo]");
      if (!b) return;
      var t = tablas[clave], campo = b.dataset.campo;
      if (t.campo === campo) t.dir = t.dir === "asc" ? "desc" : "asc";
      else { t.campo = campo; t.dir = campo === "pos" ? "asc" : "desc"; } // mejor posición = número menor
      repintar();
      var nuevo = $(idTabla).querySelector('button[data-campo="' + campo + '"]');
      if (nuevo) nuevo.focus();
    });
  }

  /* ---------- Mantenimiento ---------- */
  function anillo(frac, centro) {
    var r = 40, c = 2 * Math.PI * r;
    return '<div class="anillo"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<circle class="pista" cx="50" cy="50" r="' + r + '"/>' +
      '<circle class="avance" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) +
      '" data-final="' + (c * (1 - frac)).toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><span>' + centro + "</span></div>";
  }

  function pintarMantenimiento(info) {
    var m = info.mantenimiento, cumple = m.disponibilidad >= 99.9;
    var c = m.copias, u = m.actualizaciones;
    $("mant").innerHTML =
      '<article class="mant-item"><div class="mant-cab"><span class="kpi-ico">' + ico("activity", 18) + "</span><h3>Web disponible</h3></div>" +
      '<div class="mant-cuerpo">' + anillo(m.disponibilidad / 100, dec(m.disponibilidad, 2) + " %") +
      "<div><p>" + m.minutosCaidos + " minutos sin servicio en todo el mes.</p>" +
      '<span class="estado ' + (cumple ? "ok" : "mal") + '">' + ico("shield-check", 14) + (cumple ? "Objetivo del 99,9 % cumplido" : "Por debajo del objetivo") + "</span></div></div></article>" +

      '<article class="mant-item"><div class="mant-cab"><span class="kpi-ico">' + ico("hard-drive", 18) + "</span><h3>Copias de seguridad</h3></div>" +
      '<div class="mant-cuerpo">' + anillo(c[0] / c[1], c[0] + "/" + c[1]) +
      "<div><p>Copias diarias hechas y comprobadas.</p>" +
      '<span class="estado ok">' + ico("check", 14) + "Ninguna copia fallida</span></div></div></article>" +

      '<article class="mant-item"><div class="mant-cab"><span class="kpi-ico">' + ico("refresh-cw", 18) + "</span><h3>Actualizaciones</h3></div>" +
      '<div class="mant-cuerpo mant-barra"><div class="barra-dato"><b>' + u[0] + '</b> de ' + u[1] + " aplicadas</div>" +
      '<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + u[1] + '" aria-valuenow="' + u[0] + '" aria-label="Actualizaciones aplicadas">' +
      '<span data-final="' + Math.round(u[0] / u[1] * 100) + '" style="width:0"></span></div>' +
      "<p>Gestor de contenidos y complementos al día.</p></div></article>";

    // Animación de entrada: se parte de vacío y se pasa al valor final en el siguiente fotograma
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".avance"), function (e) { e.setAttribute("stroke-dashoffset", e.dataset.final); });
      Array.prototype.forEach.call(document.querySelectorAll(".barra span"), function (e) { e.style.width = e.dataset.final + "%"; });
    });
  }

  /* ---------- Acciones ---------- */
  function pintarAcciones(info) {
    $("hecho").innerHTML = info.hecho.map(function (h) {
      return '<li><span class="marca hecho-ok" aria-label="Hecho">' + ico("check", 13) + '</span><div><span class="dia">' + esc(h.dia) + "</span><p>" + esc(h.texto) + "</p></div></li>";
    }).join("");
    $("prox-titulo").textContent = "Qué haremos en " + info.siguiente;
    $("prox").innerHTML = info.proximo.map(function (p, j) {
      var en = j === 0;
      return '<li><span class="marca vacia" aria-hidden="true"></span><p>' + esc(p.texto) + '</p><span class="estado-tarea ' +
        (en ? "en-curso" : "pronto") + '">' + (en ? "En curso" : "Próximamente") + "</span></li>";
    }).join("");
  }

  /* ---------- Cabecera, mes, tema ---------- */
  function pintar(clave) {
    var info = D.informes[clave], i = info.indice;
    estado.mes = clave;
    pintarInsight(i, info);
    pintarKpis(i);
    estado.evo.activo(i);
    pintarBusquedas(i, info);
    pintarPaginas(i, info);
    pintarMantenimiento(info);
    pintarAcciones(info);
    Array.prototype.forEach.call(document.querySelectorAll("#meses button"), function (b) {
      var on = b.dataset.mes === clave;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
    });
    $("panel").setAttribute("aria-labelledby", "tab-" + clave);
  }

  function iniciarMeses() {
    var claves = Object.keys(D.informes);
    $("meses").innerHTML = claves.map(function (k) {
      return '<button type="button" role="tab" id="tab-' + k + '" data-mes="' + k + '" aria-selected="false" tabindex="-1">' + D.informes[k].nombre + "</button>";
    }).join("");
    $("meses").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-mes]");
      if (!b) return;
      pintar(b.dataset.mes);
      try { history.replaceState(null, "", "#" + b.dataset.mes); } catch (x) { /* en un iframe puede no estar permitido */ }
    });
    $("meses").addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var k = claves.indexOf(estado.mes), sig = claves[(k + d + claves.length) % claves.length];
      pintar(sig);
      $("tab-" + sig).focus();
    });
  }

  function iniciarTema() {
    var boton = $("tema");
    var aplicar = function () {
      var oscuro = document.documentElement.dataset.tema === "dark";
      boton.innerHTML = ico(oscuro ? "sun" : "moon", 18);
      boton.setAttribute("aria-pressed", oscuro);
      boton.setAttribute("aria-label", oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      boton.title = oscuro ? "Modo claro" : "Modo oscuro";
    };
    boton.addEventListener("click", function () {
      var nuevo = document.documentElement.dataset.tema === "dark" ? "light" : "dark";
      document.documentElement.dataset.tema = nuevo;
      try { localStorage.setItem("zyro-tema", nuevo); } catch (e) { /* sin almacenamiento: vale solo para esta visita */ }
      aplicar();
    });
    aplicar();
  }

  /* ---------- Arranque ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-icono]"), function (e) {
    e.insertAdjacentHTML("afterbegin", ico(e.dataset.icono, e.tagName === "BUTTON" ? 16 : 17));
  });
  $("dominio").innerHTML = ico("globe", 14) + D.dominio;
  $("agencia").innerHTML = ico("sparkles", 13) + "Informe generado por <strong>" + esc(D.agencia) + "</strong>";
  Array.prototype.forEach.call(document.querySelectorAll("[data-contacto]"), function (a) { a.setAttribute("href", D.contacto); });

  iniciarMeses();
  iniciarTema();
  crearEvolucion(D.informes[estado.mes].indice);
  conectarTabla("busq", "q-busq", "t-busq", function () { pintarBusquedas(D.informes[estado.mes].indice, D.informes[estado.mes]); });
  conectarTabla("pag", "q-pag", "t-pag", function () { pintarPaginas(D.informes[estado.mes].indice, D.informes[estado.mes]); });

  $("pdf").addEventListener("click", function () { window.print(); });

  // El gráfico se ajusta al ancho disponible
  if (window.ResizeObserver) {
    var anchoPrevio = 0;
    new ResizeObserver(function () {
      var w = $("evo").clientWidth;
      if (Math.abs(w - anchoPrevio) > 1) { anchoPrevio = w; estado.evo.redibujar(); }
    }).observe($("evo"));
  }

  var pedido = (location.hash || "").replace("#", "");
  pintar(D.informes[pedido] ? pedido : estado.mes);
})();
