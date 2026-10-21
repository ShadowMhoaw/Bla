(function () {
  var D = window.INFORME;
  var NS = "http://www.w3.org/2000/svg";
  var nf = new Intl.NumberFormat("es-ES");
  var coma = function (n, d) { return n.toFixed(d).replace(".", ","); };
  var $ = function (id) { return document.getElementById(id); };
  var actual = "septiembre";

  function el(nombre, attrs, texto) {
    var e = document.createElement(nombre);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto != null) e.textContent = texto;
    return e;
  }

  function pastilla(delta, texto) {
    return el("span", { "class": "delta" + (delta < 0 ? " baja" : "") }, (delta < 0 ? "↓ " : delta > 0 ? "↑ " : "") + texto);
  }

  function cifras(m) {
    var lista = [
      ["Clics desde Google", nf.format(m.clics), m.dClics, "+" + m.dClics + " %"],
      ["Impresiones", nf.format(m.impresiones), m.dImpresiones, "+" + m.dImpresiones + " %"],
      ["Posición media", coma(m.posicion, 1), m.dPosicion, coma(m.dPosicion, 1) + " puestos"],
      ["Solicitudes de presupuesto", String(m.solicitudes), m.dSolicitudes, "+" + m.dSolicitudes + " frente al mes anterior"]
    ];
    var caja = $("cifras");
    caja.textContent = "";
    lista.forEach(function (c) {
      var d = el("div", { "class": "cifra" });
      d.appendChild(el("span", { "class": "cifra-nombre" }, c[0]));
      d.appendChild(el("span", { "class": "cifra-valor" }, c[1]));
      d.appendChild(pastilla(c[2], c[3]));
      caja.appendChild(d);
    });
  }

  function resumen(m) {
    var p = $("resumen");
    p.textContent = "";
    var t = function (s) { p.appendChild(document.createTextNode(s)); };
    var b = function (s) { p.appendChild(el("strong", {}, s)); };
    t("En " + m.nombre.toLowerCase() + " de 2026, la web recibió ");
    b(nf.format(m.clics) + " visitas desde Google");
    t(" (+" + m.dClics + " % respecto al mes anterior) y ");
    b(m.solicitudes + " solicitudes de presupuesto");
    t(". Estuvo disponible el " + m.disponibilidad + " % del tiempo y todas las copias de seguridad se hicieron correctamente.");
  }

  function cambio(v) {
    if (!v) return el("span", { "class": "igual" }, "=");
    return el("span", { "class": "sube" }, "↑ " + coma(v, 1));
  }

  function busquedas(m) {
    var tb = $("busquedas");
    tb.textContent = "";
    m.busquedas.forEach(function (f) {
      var tr = el("tr");
      tr.appendChild(el("td", {}, f[0]));
      tr.appendChild(el("td", { "class": "num" }, String(f[1])));
      tr.appendChild(el("td", { "class": "num" }, coma(f[2], 1)));
      var td = el("td", { "class": "num" });
      td.appendChild(cambio(f[3]));
      tr.appendChild(td);
      tb.appendChild(tr);
    });
    var o = el("tr", { "class": "otras" });
    o.appendChild(el("td", {}, "Otras búsquedas"));
    o.appendChild(el("td", { "class": "num" }, String(m.otrasBusquedas)));
    o.appendChild(el("td", { "class": "num" }, "–"));
    o.appendChild(el("td", { "class": "num" }, ""));
    tb.appendChild(o);
  }

  function paginas(m) {
    var tb = $("paginas");
    tb.textContent = "";
    m.paginas.forEach(function (f) {
      var tr = el("tr");
      var td = el("td");
      td.appendChild(el("span", { "class": "ruta" }, f[0]));
      td.appendChild(el("span", { "class": "nota" }, f[1]));
      tr.appendChild(td);
      tr.appendChild(el("td", { "class": "num" }, String(f[2])));
      tr.appendChild(el("td", { "class": "num" }, coma(f[3], 1)));
      tb.appendChild(tr);
    });
  }

  function mantenimiento(m) {
    var caja = $("mantenimiento");
    caja.textContent = "";
    var tarjetas = [
      ["Web disponible", m.disponibilidad + " %", m.minutosCaidos + " minutos sin servicio en todo el mes."],
      ["Copias de seguridad", m.copias, "Copias diarias hechas y comprobadas."],
      ["Actualizaciones", String(m.actualizaciones), "Gestor de contenidos y complementos al día."]
    ];
    tarjetas.forEach(function (t) {
      var d = el("div", { "class": "tarea" });
      d.appendChild(el("h3", {}, t[0]));
      d.appendChild(el("div", { "class": "gran" }, t[1]));
      d.appendChild(el("p", {}, t[2]));
      caja.appendChild(d);
    });
    var ul = el("ul", { "class": "hecho" });
    m.hecho.forEach(function (h) { ul.appendChild(el("li", {}, h)); });
    var cont = el("div", { "class": "tarea", style: "grid-column: 1 / -1" });
    cont.appendChild(el("h3", {}, "Lo que hemos hecho este mes"));
    cont.appendChild(ul);
    caja.appendChild(cont);
  }

  function proximo(m) {
    $("proximo-titulo").textContent = "Qué haremos en " + m.siguiente;
    var ul = $("proximo");
    ul.textContent = "";
    m.proximo.forEach(function (p) {
      var li = el("li");
      li.appendChild(el("span", {}, p[0]));
      li.appendChild(el("span", {}, p[1]));
      ul.appendChild(li);
    });
  }

  function grafico(m) {
    var caja = $("grafico");
    var W = Math.max(caja.clientWidth || 760, 300), estrecho = W < 560;
    var H = estrecho ? 210 : 220, x0 = 38, x1 = W - 16, y0 = H - 32, y1 = 14, max = 550;
    var s = D.serie, n = s.clics.length;
    var X = function (i) { return x0 + (x1 - x0) * i / (n - 1); };
    var Y = function (v) { return y0 - (y0 - y1) * v / max; };
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Clics desde Google al mes, de " + s.primerMes + " a septiembre de 2026: de " + s.clics[0] + " a " + s.clics[n - 1] + ".");

    var defs = document.createElementNS(NS, "defs");
    defs.innerHTML = '<linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a3e635" stop-opacity=".55"/><stop offset="1" stop-color="#a3e635" stop-opacity="0"/></linearGradient>';
    svg.appendChild(defs);

    [0, 138, 275, 413, 550].forEach(function (t) {
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x0); l.setAttribute("x2", x1); l.setAttribute("y1", Y(t)); l.setAttribute("y2", Y(t));
      l.setAttribute("class", "rejilla"); svg.appendChild(l);
      var tx = document.createElementNS(NS, "text");
      tx.setAttribute("x", x0 - 8); tx.setAttribute("y", Y(t) + 3); tx.setAttribute("text-anchor", "end");
      tx.setAttribute("class", "eje"); tx.textContent = t; svg.appendChild(tx);
    });

    var puntos = s.clics.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); });
    var area = document.createElementNS(NS, "path");
    area.setAttribute("d", "M" + X(0) + "," + y0 + " L" + puntos.join(" L") + " L" + X(n - 1) + "," + y0 + " Z");
    area.setAttribute("class", "area"); svg.appendChild(area);
    var linea = document.createElementNS(NS, "path");
    linea.setAttribute("d", "M" + puntos.join(" L")); linea.setAttribute("class", "linea"); svg.appendChild(linea);

    var ia = m.indice;
    var guia = document.createElementNS(NS, "line");
    guia.setAttribute("x1", X(ia)); guia.setAttribute("x2", X(ia)); guia.setAttribute("y1", Y(s.clics[ia])); guia.setAttribute("y2", y0);
    guia.setAttribute("class", "guia"); svg.appendChild(guia);

    s.clics.forEach(function (v, i) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", X(i)); c.setAttribute("cy", Y(v)); c.setAttribute("r", i === ia ? 6 : 3.5);
      c.setAttribute("class", "punto" + (i === ia ? " activo" : ""));
      var t = document.createElementNS(NS, "title");
      t.textContent = s.etiquetas[i] + ": " + v + " clics";
      c.appendChild(t); svg.appendChild(c);
      if (estrecho && (n - 1 - i) % 2) return;
      var mes = document.createElementNS(NS, "text");
      mes.setAttribute("x", X(i)); mes.setAttribute("y", H - 8); mes.setAttribute("text-anchor", "middle");
      mes.setAttribute("class", "eje" + (i === ia ? " mes-activo" : "")); mes.textContent = s.etiquetas[i];
      svg.appendChild(mes);
    });

    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "etiqueta");
    var tx = Math.min(Math.max(X(ia), x0 + 20), x1 - 20);
    var ty = Math.max(Y(s.clics[ia]) - 30, 2);
    g.innerHTML = '<rect x="' + (tx - 22) + '" y="' + ty + '" width="44" height="20" rx="6"/><text x="' + tx + '" y="' + (ty + 14) + '">' + s.clics[ia] + "</text>";
    svg.appendChild(g);

    caja.textContent = "";
    caja.appendChild(svg);
  }

  function pintar(clave) {
    var m = D.meses[clave];
    actual = clave;
    resumen(m); cifras(m); grafico(m); busquedas(m); paginas(m); mantenimiento(m); proximo(m);
    Array.prototype.forEach.call(document.querySelectorAll(".meses button"), function (b) {
      var on = b.dataset.mes === clave;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    $("panel").setAttribute("aria-labelledby", "tab-" + clave);
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".meses button"));
  tabs.forEach(function (b, i) {
    b.addEventListener("click", function () { pintar(b.dataset.mes); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var s = tabs[(i + d + tabs.length) % tabs.length];
      s.focus(); pintar(s.dataset.mes);
    });
  });
  var ancho = 0, tic;
  window.addEventListener("resize", function () {
    clearTimeout(tic);
    tic = setTimeout(function () {
      var w = $("grafico").clientWidth;
      if (Math.abs(w - ancho) > 1) { ancho = w; grafico(D.meses[actual]); }
    }, 120);
  });
  $("pdf").addEventListener("click", function () { window.print(); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-contacto]"), function (a) { a.setAttribute("href", D.contacto); });

  var pedido = (location.hash || "").replace("#", "");
  pintar(D.meses[pedido] ? pedido : actual);
})();
