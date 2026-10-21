/* Informe mensual de SEO: pinta el panel a partir de window.INFORME.
   Estructura: utilidades · movimiento · KPI · resumen · evolución · tablas · mantenimiento · acciones ·
   mes y calendario · contacto · tema · arranque. */
(function () {
  "use strict";

  var D = window.INFORME, S = D.serie, ico = window.icono, G = window.Graficos;
  var $ = function (id) { return document.getElementById(id); };
  var raiz = document.documentElement;

  /* ---------- Utilidades ---------- */
  var formato = function (d) { return new Intl.NumberFormat("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d }); };
  var N = function (n) { return formato(0).format(n); };
  var dec = function (n, d) { return Number(n).toFixed(d).replace(".", ","); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  // Primera letra en mayúscula (solo para mostrar: los filtros usan el texto original)
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var plano = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var pc = function (n) { return n + "\u00a0%"; }; // número y % siempre juntos
  var suma = function (a, f) { return a.reduce(function (t, x) { return t + f(x); }, 0); };

  S.ctr = S.clics.map(function (c, i) { return c / S.impresiones[i] * 100; });
  // Valor del mes anterior; el primer mes se compara con el mes de partida (septiembre de 2025)
  var previo = function (k, i) { return i > 0 ? S[k][i - 1] : S.base[k]; };

  var MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  var claves = Object.keys(D.informes).sort();
  var ultima = claves[claves.length - 1];
  var anios = claves.map(function (k) { return D.informes[k].anio; });
  var anioMin = Math.min.apply(null, anios), anioMax = Math.max.apply(null, anios);
  var etiquetaMes = function (k) { return D.informes[k].nombre + " " + D.informes[k].anio; };

  var estado = { mes: ultima, anio: anioMax, evo: null, listo: false, mostrado: {} };
  var tablas = {
    busq: { q: "", campo: "clics", dir: "desc" },
    pag: { q: "", campo: "clics", dir: "desc" }
  };

  var esOportunidad = function (p) { return p > 10 && p <= D.oportunidadMax; };
  var claseTop = function (p) { return p <= 3 ? "b-top" : p <= 10 ? "b-medio" : "b-gris"; };
  var badgePos = function (p) { return '<span class="badge ' + claseTop(p) + '">' + dec(p, 1) + "</span>"; };

  /* ---------- Movimiento ---------- */
  // Hace que los hijos de un contenedor entren uno tras otro (la animación vive en el CSS)
  function aparecer(cont, selector) {
    if (G.reducido()) return;
    Array.prototype.forEach.call(cont.querySelectorAll(selector), function (e, i) {
      e.style.setProperty("--i", i);
      e.classList.add("apar");
    });
  }

  // Cuenta de un valor a otro con la misma curva de frenado que el resto
  function contar(el, desde, hasta, d, dur) {
    var f = formato(d);
    if (G.reducido() || desde === hasta) { el.textContent = f.format(hasta); return; }
    el.textContent = f.format(desde);
    G.animar(dur || 1000, function (t) { el.textContent = f.format(desde + (hasta - desde) * t); });
  }

  // Coloca la píldora deslizante bajo la opción elegida de un control segmentado
  function pildora(cont, sinAnimar) {
    var p = cont.querySelector(".pildora"), sel = cont.querySelector('[aria-pressed="true"]');
    if (!p || !sel) return;
    if (sinAnimar) p.style.transition = "none";
    cont.style.setProperty("--x", sel.offsetLeft + "px");
    cont.style.setProperty("--w", sel.offsetWidth + "px");
    if (sinAnimar) { void p.offsetWidth; p.style.transition = ""; }
  }

  var temporizadorAviso;
  function avisar(texto) {
    var a = $("aviso");
    a.textContent = texto;
    a.classList.add("ver");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { a.classList.remove("ver"); }, 3600);
  }

  /* ---------- KPI ---------- */
  var KPIS = [
    { id: "clics", nombre: "Clics desde Google", icono: "mouse", dec: 0,
      ayuda: "Las veces que alguien vio tu web en Google y entró en ella. Son visitas reales." },
    { id: "impresiones", nombre: "Impresiones", icono: "eye", dec: 0,
      ayuda: "Las veces que tu web apareció en los resultados de Google, aunque nadie llegara a pulsar." },
    { id: "posicion", nombre: "Posición media", icono: "target", dec: 1, invertido: true,
      ayuda: "El puesto medio en el que sales en Google. Cuanto más bajo el número, mejor: el 1 es el primer resultado." },
    { id: "solicitudes", nombre: "Solicitudes de presupuesto", icono: "file-text", dec: 0,
      ayuda: "Personas que han pedido presupuesto desde la web. Son clientes potenciales." }
  ];

  function pintarKpis(i, primera) {
    var mesAnterior = i > 0 ? D.nombresMes[i - 1].toLowerCase() : "septiembre de 2025";
    $("kpis").innerHTML = KPIS.map(function (k, j) {
      var act = S[k.id][i], prev = previo(k.id, i), mejor, texto;
      if (k.id === "posicion") { mejor = prev - act >= 0; texto = dec(Math.abs(prev - act), 1) + " puestos"; }
      else if (k.id === "solicitudes") { mejor = act >= prev; texto = (act >= prev ? "+" : "−") + Math.abs(act - prev); }
      else { var p = Math.round((act / prev - 1) * 100); mejor = p >= 0; texto = (p >= 0 ? "+" : "−") + Math.abs(p) + " %"; }
      var hist = [S.base[k.id]].concat(S[k.id]);          // el mes de partida da un punto más a los primeros meses
      var serie = hist.slice(Math.max(0, i - 4), i + 2);
      return '<article class="kpi' + (primera ? " entra" : "") + '" style="--i:' + (3 + j) + '">' +
        '<div class="kpi-cab"><span class="kpi-ico">' + ico(k.icono, 18) + "</span>" +
        '<span class="kpi-nombre">' + k.nombre + "</span>" +
        '<button type="button" class="info" aria-describedby="ayuda-' + k.id + '" aria-label="¿Qué significa «' + k.nombre + '»?">' + ico("info", 16) + "</button>" +
        '<span class="ayuda" role="tooltip" id="ayuda-' + k.id + '">' + k.ayuda + "</span></div>" +
        '<div class="kpi-valor" data-id="' + k.id + '">' + formato(k.dec).format(act) + "</div>" +
        '<div class="kpi-pie"><div><span class="delta ' + (mejor ? "ok" : "mal") + '">' +
        ico(mejor ? "arrow-up" : "arrow-down", 13) + texto + '</span><span class="vs">Frente a ' + mesAnterior + "</span></div>" +
        G.sparkline(serie, { id: "sp-" + k.id, invertido: k.invertido, malo: !mejor }) + "</div></article>";
    }).join("");

    // Las cifras cuentan desde el valor que había (o, la primera vez, desde el mes anterior)
    KPIS.forEach(function (k) {
      var el = document.querySelector('.kpi-valor[data-id="' + k.id + '"]');
      var desde = estado.mostrado[k.id] != null ? estado.mostrado[k.id] : previo(k.id, i);
      contar(el, desde, S[k.id][i], k.dec, 1000);
      estado.mostrado[k.id] = S[k.id][i];
    });
  }

  /* ---------- Resumen del mes ----------
     Aquí se compone con plantillas a partir de los datos. En producción este texto vendría de una API o de un modelo de lenguaje. */
  function pintarInsight(i, info, primera) {
    var dPos = previo("posicion", i) - S.posicion[i];
    var top = info.paginas.slice().sort(function (a, b) { return b.clics - a.clics; })[0];
    var cuota = Math.round(top.clics / S.clics[i] * 100);
    var op = info.busquedas.filter(function (b) { return esOportunidad(b.pos); }).sort(function (a, b) { return a.pos - b.pos; })[0];

    var t = (dPos >= 0 ? "Este mes has mejorado tu posición media en <strong>" : "Este mes tu posición media ha empeorado en <strong>") +
      dec(Math.abs(dPos), 1) + " puestos</strong>, hasta el <strong>" + dec(S.posicion[i], 1) + "</strong>. " +
      "La página <strong>«" + esc(top.titulo) + "»</strong> atrae el <strong>" + pc(cuota) + "</strong> de los clics" +
      (op ? ", y «" + esc(op.q) + "» está en la posición " + dec(op.pos, 1) + ", a un paso del Top 10." : ".");

    $("insight").innerHTML =
      '<div class="insight-cab"><span class="insight-ico">' + ico("sparkles", 18) + "</span>" +
      '<h2 id="insight-titulo">Resumen de ' + info.nombre.toLowerCase() + " de " + info.anio + '</h2><span class="etiqueta-ia">Resumen automático</span></div>' +
      '<p class="insight-texto">' + t + "</p>" +
      '<div class="sugerencia">' + ico("lightbulb", 18) + "<p><strong>Sugerencia.</strong> " + esc(info.sugerencia) + "</p></div>";
    if (!primera) aparecer($("insight"), "h2, .insight-texto, .sugerencia");
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

    // Los botones se crean una vez; así la píldora puede deslizarse entre ellos
    $("metricas").innerHTML = '<span class="pildora" aria-hidden="true"></span>' + Object.keys(nombres).map(function (k) {
      return '<button type="button" data-metrica="' + k + '" aria-pressed="' + (k === actual) + '">' + nombres[k] + "</button>";
    }).join("");
    $("evo-sub").textContent = textos[actual];

    $("metricas").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-metrica]");
      if (!b || b.dataset.metrica === actual) return;
      actual = b.dataset.metrica;
      Array.prototype.forEach.call($("metricas").querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === b); });
      pildora($("metricas"));
      estado.evo.metrica(actual);
      var sub = $("evo-sub");
      sub.style.opacity = 0;
      setTimeout(function () { sub.textContent = textos[actual]; sub.style.opacity = ""; }, 180);
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
      var flecha = activa ? ico(t.dir === "asc" ? "chevron-up" : "chevron-down", 14) : ico("arrow-up-down", 14);
      return '<th scope="col" class="num" aria-sort="' + sentido + '"><button type="button" class="orden' + (activa ? " activa" : "") +
        '" data-campo="' + c.campo + '">' + c.texto + flecha + "</button></th>";
    }).join("") + "</tr></thead>";
  }

  // Subir en Google es mejorar (flecha arriba); bajar, empeorar (flecha abajo)
  function cambio(m) {
    if (m > 0) return '<span class="cambio ok">' + ico("arrow-up", 13) + dec(m, 1) + "</span>";
    if (m < 0) return '<span class="cambio baja">' + ico("arrow-down", 13) + dec(-m, 1) + "</span>";
    return '<span class="cambio igual">—</span>';
  }

  // «mover» = true cuando cambia el orden o el mes: las filas entran en cadena. Al escribir en el filtro no se animan.
  function pintarBusquedas(i, info, mover) {
    var t = tablas.busq, q = plano(t.q.trim());
    var filas = ordenar(info.busquedas.filter(function (b) { return !q || plano(b.q).indexOf(q) > -1; }), t);
    var cuerpo = filas.map(function (b, j) {
      var aviso = esOportunidad(b.pos)
        ? '<span class="oportunidad">' + ico("star", 13) + "Cerca del Top 10</span>" : "";
      return '<tr style="--i:' + j + '"><td><span class="kw">' + esc(cap(b.q)) + "</span>" + aviso + '</td><td class="num">' + b.clics +
        '</td><td class="num">' + badgePos(b.pos) + '</td><td class="num">' + cambio(b.mejora) + "</td></tr>";
    }).join("") || '<tr><td colspan="4" class="vacio">Ninguna búsqueda coincide con «' + esc(t.q.trim()) + "».</td></tr>";

    $("t-busq").innerHTML = "<caption class=\"solo-lectores\">Búsquedas que traen visitas, ordenables por clics y posición</caption>" +
      cabecera(t, [{ texto: "Palabra clave" }, { texto: "Clics", campo: "clics", num: 1 }, { texto: "Posición", campo: "pos", num: 1 }, { texto: "Cambio", num: 1 }]) +
      '<tbody class="' + (mover && !G.reducido() ? "anim" : "") + '">' + cuerpo + "</tbody>";
    var otras = S.clics[i] - suma(info.busquedas, function (b) { return b.clics; });
    $("pie-busq").textContent = "Mostrando " + filas.length + " de " + info.busquedas.length + " búsquedas · " + otras + " clics más vienen de búsquedas poco frecuentes";
  }

  function pintarPaginas(i, info, mover) {
    var t = tablas.pag, q = plano(t.q.trim());
    var filas = ordenar(info.paginas.filter(function (p) { return !q || plano(p.url + " " + p.titulo).indexOf(q) > -1; }), t);
    var cuerpo = filas.map(function (p, j) {
      return '<tr style="--i:' + j + '"><td><span class="kw">' + esc(p.titulo) + '</span><span class="url">' + esc(p.url) + '</span></td><td class="num">' + p.clics +
        '</td><td class="num">' + badgePos(p.pos) + '</td><td class="num">' + Math.round(p.clics / S.clics[i] * 100) + " %</td></tr>";
    }).join("") || '<tr><td colspan="4" class="vacio">Ninguna página coincide con «' + esc(t.q.trim()) + "».</td></tr>";

    $("t-pag").innerHTML = "<caption class=\"solo-lectores\">Páginas con más visitas, ordenables por clics y posición</caption>" +
      cabecera(t, [{ texto: "Página" }, { texto: "Clics", campo: "clics", num: 1 }, { texto: "Posición", campo: "pos", num: 1 }, { texto: "Tráfico", num: 1 }]) +
      '<tbody class="' + (mover && !G.reducido() ? "anim" : "") + '">' + cuerpo + "</tbody>";
    var otras = S.clics[i] - suma(info.paginas, function (p) { return p.clics; });
    $("pie-pag").textContent = "Mostrando " + filas.length + " de " + info.paginas.length + " páginas · " + otras + " clics más van a otras páginas";
  }

  function conectarTabla(clave, idBuscador, idTabla, repintar) {
    $(idBuscador).addEventListener("input", function (e) { tablas[clave].q = e.target.value; repintar(false); });
    $(idTabla).addEventListener("click", function (e) {
      var b = e.target.closest("button[data-campo]");
      if (!b) return;
      var t = tablas[clave], campo = b.dataset.campo;
      if (t.campo === campo) t.dir = t.dir === "asc" ? "desc" : "asc";
      else { t.campo = campo; t.dir = campo === "pos" ? "asc" : "desc"; } // mejor posición = número menor
      repintar(true);
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

  function pintarMantenimiento(info, primera) {
    var m = info.mantenimiento, cumple = m.disponibilidad >= 99.9;
    var c = m.copias, u = m.actualizaciones, falladas = c[1] - c[0];
    var textoCaida = m.minutosCaidos < 30
      ? "Solo " + m.minutosCaidos + " minutos sin servicio en todo el mes. Objetivo: " + pc("99,9") + "."
      : "Hubo " + m.minutosCaidos + " minutos sin servicio por una incidencia. Objetivo: " + pc("99,9") + ".";
    $("mant").innerHTML =
      '<article class="mant-item"><div class="mant-cab"><span class="kpi-ico">' + ico("activity", 18) + "</span><h3>Web disponible</h3></div>" +
      '<div class="mant-cuerpo">' + anillo(m.disponibilidad / 100, pc(dec(m.disponibilidad, 2))) +
      "<div><p>" + textoCaida + "</p>" +
      '<span class="estado ' + (cumple ? "ok" : "mal") + '">' + ico("shield-check", 13) + (cumple ? "Objetivo cumplido" : "Bajo el objetivo") + "</span></div></div></article>" +

      '<article class="mant-item"><div class="mant-cab"><span class="kpi-ico">' + ico("hard-drive", 18) + "</span><h3>Copias de seguridad</h3></div>" +
      '<div class="mant-cuerpo">' + anillo(c[0] / c[1], c[0] + "/" + c[1]) +
      "<div><p>" + (falladas ? (falladas === 1 ? "Una copia falló y se repitió al momento." : falladas + " copias fallaron y se repitieron al momento.") : "Copias diarias hechas y comprobadas.") + "</p>" +
      '<span class="estado ' + (falladas ? "mal" : "ok") + '">' + ico(falladas ? "refresh-cw" : "check", 13) +
      (falladas ? (falladas === 1 ? "1 copia fallida" : falladas + " copias fallidas") : "Ninguna copia fallida") + "</span></div></div></article>" +

      '<article class="mant-item"><div class="mant-cab"><span class="kpi-ico">' + ico("refresh-cw", 18) + "</span><h3>Actualizaciones</h3></div>" +
      '<div class="mant-cuerpo mant-barra"><div class="barra-dato">Aplicadas: <b>' + u[0] + '</b> de ' + u[1] + "</div>" +
      '<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + u[1] + '" aria-valuenow="' + u[0] + '" aria-label="Actualizaciones aplicadas">' +
      '<span data-final="' + Math.round(u[0] / u[1] * 100) + '" style="width:0"></span></div>' +
      "<p>Gestor de contenidos y complementos al día.</p></div></article>";
    if (!primera) aparecer($("mant"), ".mant-item");

    // Anillos y barra parten de vacío y se llenan en el siguiente fotograma (en la primera carga, tras la entrada de la tarjeta)
    setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".avance"), function (e) { e.setAttribute("stroke-dashoffset", e.dataset.final); });
      Array.prototype.forEach.call(document.querySelectorAll(".barra span"), function (e) { e.style.width = e.dataset.final + "%"; });
    }, G.reducido() ? 0 : primera ? 500 : 40);
  }

  /* ---------- Acciones ---------- */
  function pintarAcciones(info, primera) {
    $("hecho").innerHTML = info.hecho.map(function (h, j) {
      return '<li style="--i:' + j + '"><span class="marca hecho-ok" aria-label="Hecho">' + ico("check", 13) + '</span><div><span class="dia">' + esc(h.dia) + "</span><p>" + esc(h.texto) + "</p></div></li>";
    }).join("");
    $("prox-titulo").textContent = "Qué haremos en " + info.siguiente;
    $("prox").innerHTML = info.proximo.map(function (p, j) {
      var en = j === 0;
      return '<li><span class="marca vacia" aria-hidden="true"></span><p>' + esc(p.texto) + '</p><span class="estado-tarea ' +
        (en ? "en-curso" : "pronto") + '">' + (en ? "En curso" : "Próximamente") + "</span></li>";
    }).join("");
    if (!primera) { aparecer($("hecho"), "li > div"); aparecer($("prox"), "li"); }
  }

  /* ---------- Mes ---------- */
  function pintar(clave) {
    var info = D.informes[clave], i = info.indice, primera = !estado.listo;
    estado.mes = clave;
    pintarInsight(i, info, primera);
    pintarKpis(i, primera);
    estado.evo.activo(i);
    pintarBusquedas(i, info, !primera);
    pintarPaginas(i, info, !primera);
    pintarMantenimiento(info, primera);
    pintarAcciones(info, primera);
    pintarSelector(primera);
    if (estado.listo) actualizarContacto();
    estado.listo = true;
  }

  /* ---------- Selector de mes y calendario ----------
     Muestra los doce meses de cada año; los que no tienen informe aparecen atenuados. */
  function pintarSelector(primera) {
    var t = $("mes-texto"), nuevo = etiquetaMes(estado.mes);
    if (t.textContent !== nuevo) {
      t.textContent = nuevo;
      if (!primera && !G.reducido()) { t.classList.remove("cambia"); void t.offsetWidth; t.classList.add("cambia"); }
    }
    var k = claves.indexOf(estado.mes);
    $("mes-ant").disabled = k <= 0;
    $("mes-sig").disabled = k >= claves.length - 1;
    if ($("calendario").classList.contains("abierto")) pintarCeldas(0);
  }

  function pintarCeldas(dir) {
    var a = estado.anio, html = "", grid = $("cal-grid"), anio = $("cal-anio");
    for (var m = 1; m <= 12; m++) {
      var k = a + "-" + (m < 10 ? "0" : "") + m, inf = D.informes[k];
      html += inf
        ? '<button type="button" class="cal-mes" data-clave="' + k + '" data-m="' + m + '" aria-pressed="' + (k === estado.mes) + '" style="--i:' + (m - 1) + '" aria-label="' +
          inf.nombre + " de " + a + ", " + N(S.clics[inf.indice]) + ' clics"><span>' + CORTOS[m - 1] + "</span><small>" + N(S.clics[inf.indice]) + "</small></button>"
        : '<button type="button" class="cal-mes" data-m="' + m + '" disabled style="--i:' + (m - 1) + '" aria-label="' + MESES[m - 1] + " de " + a + ', sin informe"><span>' +
          CORTOS[m - 1] + "</span><small>—</small></button>";
    }
    grid.innerHTML = html;
    grid.className = "cal-grid" + (dir && !G.reducido() ? (dir > 0 ? " desde-der" : " desde-izq") : "");
    if (anio.textContent !== String(a)) {
      anio.textContent = a;
      if (dir && !G.reducido()) { anio.classList.remove("cambia"); void anio.offsetWidth; anio.classList.add("cambia"); }
    }
    $("anio-ant").disabled = a <= anioMin;
    $("anio-sig").disabled = a >= anioMax;
  }

  function iniciarSelector() {
    var btn = $("mes-btn"), cal = $("calendario"), grid = $("cal-grid");

    function abierto() { return cal.classList.contains("abierto"); }
    function irA(clave) { if (clave !== estado.mes) { pintar(clave); guardarHash(clave); } }
    function guardarHash(clave) { try { history.replaceState(null, "", "#" + clave); } catch (x) { /* en un iframe puede no estar permitido */ } }

    function abrir() {
      estado.anio = D.informes[estado.mes].anio;
      pintarCeldas(0);
      cal.classList.add("abierto");
      cal.removeAttribute("inert");
      cal.setAttribute("aria-hidden", "false");
      btn.setAttribute("aria-expanded", "true");
      setTimeout(function () {
        var s = grid.querySelector('[aria-pressed="true"]') || grid.querySelector("button:not(:disabled)");
        if (s) s.focus({ preventScroll: true });
      }, 80);
      document.addEventListener("pointerdown", fuera, true);
      document.addEventListener("keydown", tecla);
    }
    function cerrar(devolverFoco) {
      cal.classList.remove("abierto");
      cal.setAttribute("inert", "");
      cal.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", fuera, true);
      document.removeEventListener("keydown", tecla);
      if (devolverFoco) btn.focus({ preventScroll: true });
    }
    function fuera(e) { if (!$("selector").contains(e.target)) cerrar(false); }
    function tecla(e) {
      if (e.key === "Escape") { e.preventDefault(); cerrar(true); return; }
      // Flechas dentro de la cuadrícula: ±1 mes y ±3 (una fila); se salta lo que no tiene informe
      var paso = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[e.key];
      var act = document.activeElement;
      if (!paso || !act || !act.classList.contains("cal-mes")) return;
      e.preventDefault();
      var m = +act.dataset.m + paso;
      while (m >= 1 && m <= 12) {
        var c = grid.querySelector('[data-m="' + m + '"]');
        if (c && !c.disabled) { c.focus(); return; }
        m += paso;
      }
    }

    btn.addEventListener("click", function () { abierto() ? cerrar(false) : abrir(); });
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".cal-mes");
      if (!b || b.disabled) return;
      irA(b.dataset.clave);
      cerrar(true);
    });
    $("anio-ant").addEventListener("click", function () { if (estado.anio > anioMin) { estado.anio--; pintarCeldas(-1); } });
    $("anio-sig").addEventListener("click", function () { if (estado.anio < anioMax) { estado.anio++; pintarCeldas(1); } });
    $("ultimo").addEventListener("click", function () { irA(ultima); cerrar(true); });
    $("mes-ant").addEventListener("click", function () { var k = claves.indexOf(estado.mes); if (k > 0) irA(claves[k - 1]); });
    $("mes-sig").addEventListener("click", function () { var k = claves.indexOf(estado.mes); if (k < claves.length - 1) irA(claves[k + 1]); });
  }

  /* ---------- Contacto con Zyro ----------
     En el producto real el mensaje llegaría al equipo de Zyro junto con el mes que se está viendo.
     Aquí no se envía nada: se enseña la vista previa de cómo lo recibiría el equipo. */
  var borrador = "";
  var borradorAuto = false; // true mientras el borrador sea solo texto puesto por los atajos (y no escrito a mano)

  // Atajos del mes que se está viendo; cada uno trae el texto que se añade al mensaje
  function atajos(info) {
    var op = info.busquedas.filter(function (b) { return esOportunidad(b.pos); }).sort(function (a, b) { return a.pos - b.pos; })[0];
    return [
      op ? { etiqueta: "Subir «" + op.q + "» al Top 10", texto: "Quiero subir «" + op.q + "» al Top 10 (ahora está en la posición " + dec(op.pos, 1) + ")." }
         : { etiqueta: "Mejorar una palabra clave", texto: "Quiero mejorar una palabra clave." },
      { etiqueta: "Una duda sobre el informe", texto: "Tengo una duda sobre el informe de " + info.nombre.toLowerCase() + " de " + info.anio + "." },
      { etiqueta: "Pedir una mejora o una página nueva", texto: "Quiero pedir una mejora o una página nueva." },
      { etiqueta: "Hablar con una persona", texto: "Prefiero hablar con una persona de Zyro." }
    ];
  }

  function pintarContacto(enfocar) {
    var temas = atajos(D.informes[estado.mes]);
    $("contacto-form").innerHTML =
      '<span class="etiqueta">¿Sobre qué quieres hablar?</span>' +
      '<div class="chips">' + temas.map(function (t, j) { return '<button type="button" class="chip" data-tema="' + j + '">' + esc(t.etiqueta) + "</button>"; }).join("") + "</div>" +
      '<label for="mensaje">Tu mensaje</label>' +
      '<textarea id="mensaje" placeholder="Escribe aquí lo que quieras preguntar o mejorar" aria-describedby="error-mensaje"></textarea>' +
      '<p class="error-msg" id="error-mensaje" role="alert" hidden>Escribe un mensaje para que podamos ayudarte.</p>' +
      '<div class="form-pie"><button type="button" class="boton boton-primario" id="enviar"><span class="ico-env">' + ico("send", 16) + "</span>Enviar a Zyro</button>" +
      '<p class="nota-demo">Demostración: en tu informe real, el mensaje llega a tu equipo de Zyro con el mes que estás viendo.</p></div>';
    var caja = $("mensaje");
    caja.value = borrador;
    caja.addEventListener("input", function () { borrador = caja.value; borradorAuto = false; $("error-mensaje").hidden = true; });
    $("contacto-form").querySelector(".chips").addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      var texto = temas[+b.dataset.tema].texto;
      if (borrador.indexOf(texto) > -1) { caja.focus(); return; }          // el mismo atajo no se añade dos veces
      var vacio = !caja.value.trim();
      caja.value = vacio ? texto : caja.value.replace(/\s+$/, "") + "\n" + texto;
      borrador = caja.value;
      borradorAuto = vacio || borradorAuto;
      $("error-mensaje").hidden = true;
      caja.focus();
    });
    $("enviar").addEventListener("click", enviar);
    if (enfocar) caja.focus({ preventScroll: true });
  }

  // Al cambiar de mes, un borrador hecho solo con atajos se descarta: hablaría de otro mes. Lo escrito a mano se conserva.
  function actualizarContacto() {
    if (!$("mensaje")) return; // se está viendo la vista previa; no se pisa
    if (borradorAuto) { borrador = ""; borradorAuto = false; }
    pintarContacto(false);
  }

  function enviar() {
    var texto = $("mensaje").value.trim();
    if (texto.length < 3) { $("error-mensaje").hidden = false; $("mensaje").focus(); return; }
    var info = D.informes[estado.mes], i = info.indice;
    $("contacto-form").innerHTML =
      '<div class="vista-previa"><h3><span class="marca">' + ico("check", 13) + "</span>Así lo recibiría tu equipo de Zyro</h3>" +
      '<div class="correo"><dl><dt>Cliente</dt><dd>' + esc(D.cliente) + " · " + esc(D.dominio) + "</dd>" +
      "<dt>Informe</dt><dd>" + esc(info.nombre + " de " + info.anio) + "</dd>" +
      "<dt>Cifras</dt><dd>" + N(S.clics[i]) + " clics · posición media " + dec(S.posicion[i], 1) + "</dd></dl>" +
      "<blockquote>" + esc(texto) + "</blockquote></div>" +
      '<p class="nota-demo">Esto es una demostración: no se ha enviado nada. En tu informe real, tu equipo de Zyro recibiría este mensaje y te respondería.</p>' +
      '<div class="form-pie"><button type="button" class="boton" id="otro">Escribir otro mensaje</button></div></div>';
    borrador = ""; borradorAuto = false;
    $("otro").addEventListener("click", function () { pintarContacto(true); aparecer($("contacto-form"), ".etiqueta, .chips, label, textarea, .form-pie"); });
  }

  function irAContacto() {
    var c = $("contacto");
    c.scrollIntoView({ behavior: G.reducido() ? "auto" : "smooth", block: "start" });
    setTimeout(function () { var m = $("mensaje"); if (m) m.focus({ preventScroll: true }); }, G.reducido() ? 0 : 650);
  }

  /* ---------- Tema ----------
     Sin preferencia guardada manda el sistema. Al pulsar el botón se fija el contrario del que se ve ahora. */
  function iniciarTema() {
    var boton = $("tema"), oscuroSistema = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
    var efectivo = function () {
      var t = raiz.dataset.theme;
      return t === "dark" || t === "light" ? t : (oscuroSistema && oscuroSistema.matches ? "dark" : "light");
    };
    var aplicar = function () {
      var oscuro = efectivo() === "dark";
      boton.innerHTML = ico(oscuro ? "sun" : "moon", 18);
      boton.setAttribute("aria-pressed", oscuro);
      boton.setAttribute("aria-label", oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      boton.title = oscuro ? "Modo claro" : "Modo oscuro";
    };
    boton.addEventListener("click", function () {
      var nuevo = efectivo() === "dark" ? "light" : "dark";
      raiz.classList.add("cambiando");
      raiz.dataset.theme = nuevo;
      try { localStorage.setItem("zyro-tema", nuevo); } catch (e) { /* sin almacenamiento: vale solo para esta visita */ }
      setTimeout(function () { raiz.classList.remove("cambiando"); }, 650);
    });
    // Si cambia por fuera (el sistema o quien aloja la página), el icono lo sigue
    if (window.MutationObserver) new MutationObserver(aplicar).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
    if (oscuroSistema && oscuroSistema.addEventListener) oscuroSistema.addEventListener("change", aplicar);
    aplicar();
  }

  /* ---------- Arranque ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-icono]"), function (e) {
    e.insertAdjacentHTML("afterbegin", ico(e.dataset.icono, +e.dataset.tam || 16));
  });
  $("dominio").innerHTML = ico("globe", 14) + D.dominio;
  $("agencia").innerHTML = ico("sparkles", 13) + "Informe generado por <strong>" + esc(D.agencia) + "</strong>";

  // Todos los accesos a «contactar» llevan al formulario del informe; si hay una página de contacto propia, se ofrece además
  Array.prototype.forEach.call(document.querySelectorAll("[data-contacto]"), function (a) {
    a.setAttribute("href", "#contacto");
    a.addEventListener("click", function (e) { e.preventDefault(); irAContacto(); });
  });
  $("ir-contacto").addEventListener("click", irAContacto);

  // Entrada escalonada de la cabecera y las tarjetas (los KPI se escalonan solos)
  [[".cab-id", 0], [".cab-acciones", 1], ["#tema", 1], ["main > .insight", 2], ["main > .tarjeta", 7], ["main > .dos-col > .tarjeta", 8], ["main > .tarjeta ~ .tarjeta", 8]].forEach(function (par) {
    Array.prototype.forEach.call(document.querySelectorAll(par[0]), function (e) { e.classList.add("entra"); e.style.setProperty("--i", par[1]); });
  });

  iniciarTema();
  iniciarSelector();
  crearEvolucion(D.informes[estado.mes].indice);
  conectarTabla("busq", "q-busq", "t-busq", function (mover) { pintarBusquedas(D.informes[estado.mes].indice, D.informes[estado.mes], mover); });
  conectarTabla("pag", "q-pag", "t-pag", function (mover) { pintarPaginas(D.informes[estado.mes].indice, D.informes[estado.mes], mover); });

  // PDF: la impresión no está disponible dentro de la vista previa de Claude, así que allí se explica
  $("pdf").addEventListener("click", function () {
    if (window.claude) avisar("El PDF se descarga desde la web publicada. Esta vista previa no puede abrir la impresión.");
    else window.print();
  });

  // El gráfico se ajusta al ancho disponible
  var anchoPrevio = 0;
  var reajustar = function () {
    var w = $("evo").clientWidth;
    if (Math.abs(w - anchoPrevio) > 1) { anchoPrevio = w; estado.evo.redibujar(); }
    pildora($("metricas"), true);
  };
  if (window.ResizeObserver) new ResizeObserver(reajustar).observe(document.querySelector(".app"));
  else window.addEventListener("resize", reajustar);

  // Enlace directo: #2026-09 (también se entiende #septiembre y se toma el más reciente)
  var pedido = (location.hash || "").replace("#", "").toLowerCase();
  var inicial = D.informes[pedido] ? pedido : null;
  if (!inicial) claves.slice().reverse().some(function (k) { if (D.informes[k].nombre.toLowerCase() === pedido) { inicial = k; return true; } });
  pintar(inicial || ultima);
  pintarContacto(false);
  pildora($("metricas"), true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { pildora($("metricas"), true); });
})();
