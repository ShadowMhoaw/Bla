/* Datos de ejemplo de «Reformas Nova». Todo es inventado.
   Fuente única de verdad: las cifras de los KPI, sus variaciones y los CTR se calculan desde `serie`,
   así que nunca pueden contradecirse entre sí. En producción este objeto vendría de Search Console o de una API. */
window.INFORME = {
  agencia: "Zyro",
  dominio: "reformasnova.example",
  contacto: "#", // Enlace de «Quiero este servicio». Cambiar por la página de contacto de Zyro.

  // Octubre de 2025 a septiembre de 2026
  etiquetas: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep"],
  etiquetasLargas: ["Oct 2025", "Nov 2025", "Dic 2025", "Ene 2026", "Feb 2026", "Mar 2026", "Abr 2026", "May 2026", "Jun 2026", "Jul 2026", "Ago 2026", "Sep 2026"],
  nombresMes: ["Octubre", "Noviembre", "Diciembre", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
  serie: {
    clics:        [205, 225, 218, 270, 300, 295, 345, 370, 362, 425, 456, 497],
    impresiones:  [9800, 10900, 10700, 12900, 14000, 13800, 15600, 16500, 16800, 18900, 20970, 23700],
    posicion:     [12.1, 11.8, 11.9, 11.0, 10.4, 10.5, 9.8, 9.6, 8.9, 8.2, 7.5, 6.4],
    solicitudes:  [6, 7, 6, 8, 9, 8, 10, 11, 12, 14, 17, 21]
  },

  // Una posición entre 11 y OPORTUNIDAD_MAX se marca como «Cerca del Top 10»
  oportunidadMax: 13,

  informes: {
    julio: {
      nombre: "Julio", siguiente: "agosto", indice: 9,
      mantenimiento: { disponibilidad: 99.95, minutosCaidos: 22, copias: [31, 31], actualizaciones: [6, 6] },
      busquedas: [
        { q: "reformas baño alicante", clics: 115, pos: 4.1, mejora: 0.6 },
        { q: "reforma integral piso alicante", clics: 86, pos: 6.3, mejora: 0.4 },
        { q: "presupuesto reforma cocina alicante", clics: 62, pos: 7.9, mejora: 1.2 },
        { q: "cuánto cuesta reformar un baño", clics: 51, pos: 9.8, mejora: 0.3 },
        { q: "reformas nova", clics: 36, pos: 1.1, mejora: 0 },
        { q: "cambiar bañera por plato de ducha", clics: 27, pos: 10.4, mejora: 1.6 },
        { q: "ideas reforma baño pequeño", clics: 15, pos: 14.7, mejora: 0.4 },
        { q: "empresa de reformas en alicante", clics: 11, pos: 13.6, mejora: 0.5 },
        { q: "reforma cocina abierta al salón", clics: 7, pos: 15.6, mejora: 0.2 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 138, pos: 5.2 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 92, pos: 7.1 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 66, pos: 9.4 },
        { url: "/", titulo: "Inicio", clics: 60, pos: 3.8 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 41, pos: 8.8 }
      ],
      hecho: [
        { dia: "2 jul", texto: "Migración de la web a un servidor más rápido, con 22 minutos de parada de madrugada." },
        { dia: "11 jul", texto: "Compresión de las 38 fotos de la galería de baños: la portada carga en 1,9 s." },
        { dia: "24 jul", texto: "Corregidos 4 enlaces rotos hacia páginas que ya no existen." }
      ],
      proximo: [
        { texto: "Nueva página «Reforma de cocinas en Alicante»", cuando: "Agosto" },
        { texto: "Responder a las 5 reseñas nuevas de Google", cuando: "Agosto" },
        { texto: "Revisar los títulos de las páginas de servicio", cuando: "Agosto" }
      ],
      sugerencia: "Comprime las imágenes de la galería de baños: una portada más rápida ayuda a que «reformas baño alicante» llegue al Top 3."
    },

    agosto: {
      nombre: "Agosto", siguiente: "septiembre", indice: 10,
      mantenimiento: { disponibilidad: 99.99, minutosCaidos: 4, copias: [31, 31], actualizaciones: [4, 4] },
      busquedas: [
        { q: "reformas baño alicante", clics: 128, pos: 3.6, mejora: 0.5 },
        { q: "reforma integral piso alicante", clics: 90, pos: 6.0, mejora: 0.3 },
        { q: "presupuesto reforma cocina alicante", clics: 66, pos: 7.2, mejora: 0.7 },
        { q: "cuánto cuesta reformar un baño", clics: 55, pos: 9.1, mejora: 0.7 },
        { q: "reformas nova", clics: 38, pos: 1.1, mejora: 0 },
        { q: "cambiar bañera por plato de ducha", clics: 28, pos: 9.7, mejora: 0.7 },
        { q: "ideas reforma baño pequeño", clics: 16, pos: 13.5, mejora: 1.2 },
        { q: "empresa de reformas en alicante", clics: 13, pos: 12.7, mejora: 0.9 },
        { q: "reforma cocina abierta al salón", clics: 8, pos: 15.1, mejora: 0.5 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 148, pos: 4.9 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 96, pos: 6.8 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 62, pos: 9.0 },
        { url: "/reformas-de-cocinas", titulo: "Reformas de cocinas", clics: 60, pos: 7.9 },
        { url: "/", titulo: "Inicio", clics: 56, pos: 3.7 }
      ],
      hecho: [
        { dia: "6 ago", texto: "Publicada la página de reformas de cocinas, que ya recibe 60 clics al mes." },
        { dia: "14 ago", texto: "Respondidas las 5 reseñas nuevas de Google: la media sube a 4,8 sobre 5." },
        { dia: "27 ago", texto: "Reescritos los títulos de las 6 páginas de servicio." }
      ],
      proximo: [
        { texto: "Artículo «Cómo preparar el piso antes de una reforma»", cuando: "Septiembre" },
        { texto: "Añadir fotos de antes y después a la reforma integral", cuando: "Septiembre" },
        { texto: "Revisar la velocidad de la web en el móvil", cuando: "Septiembre" }
      ],
      sugerencia: "Amplía el artículo «Cuánto cuesta reformar un baño» con una tabla de precios: está en la posición 9,1 y puede entrar en el Top 5."
    },

    septiembre: {
      nombre: "Septiembre", siguiente: "octubre", indice: 11,
      mantenimiento: { disponibilidad: 99.98, minutosCaidos: 9, copias: [30, 30], actualizaciones: [5, 5] },
      busquedas: [
        { q: "reformas baño alicante", clics: 142, pos: 3.2, mejora: 0.4 },
        { q: "reforma integral piso alicante", clics: 96, pos: 5.4, mejora: 0.6 },
        { q: "presupuesto reforma cocina alicante", clics: 71, pos: 6.1, mejora: 1.1 },
        { q: "cuánto cuesta reformar un baño", clics: 58, pos: 8.2, mejora: 0.9 },
        { q: "reformas nova", clics: 44, pos: 1.1, mejora: 0 },
        { q: "cambiar bañera por plato de ducha", clics: 31, pos: 9.0, mejora: 0.7 },
        { q: "ideas reforma baño pequeño", clics: 18, pos: 11.4, mejora: 2.1 },
        { q: "empresa de reformas en alicante", clics: 14, pos: 11.8, mejora: 0.9 },
        { q: "reforma cocina abierta al salón", clics: 9, pos: 14.6, mejora: 0.5 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 150, pos: 4.5 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 98, pos: 6.1 },
        { url: "/reformas-de-cocinas", titulo: "Reformas de cocinas", clics: 72, pos: 6.9 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 64, pos: 8.3 },
        { url: "/", titulo: "Inicio", clics: 58, pos: 3.8 },
        { url: "/blog/preparar-el-piso-antes-de-reformar", titulo: "Preparar el piso antes de reformar", clics: 31, pos: 11.2 }
      ],
      hecho: [
        { dia: "4 sep", texto: "Publicado el artículo sobre cómo preparar el piso antes de una reforma." },
        { dia: "12 sep", texto: "Añadidas las fotos de antes y después a la reforma integral: la gente pasa más tiempo en la página." },
        { dia: "19 sep", texto: "Velocidad en móvil: la portada pasa de 3,4 s a 2,1 s." },
        { dia: "26 sep", texto: "Actualizados el gestor de contenidos y 4 complementos, sin incidencias." }
      ],
      proximo: [
        { texto: "Pedir reseñas a los clientes que terminaron obra en septiembre", cuando: "Octubre" },
        { texto: "Nueva página «Reformas de locales comerciales»", cuando: "Octubre" },
        { texto: "Revisar las búsquedas que están en la segunda página de Google", cuando: "Octubre" }
      ],
      sugerencia: "Optimiza la velocidad de carga en móvil de «Reforma integral» y amplía su contenido: está en la posición 6,1 y puede subir al Top 5."
    }
  }
};
