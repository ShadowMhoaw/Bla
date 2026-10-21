// Cifras inventadas de «Reformas Nova». Los meses encajan entre sí: cada variación
// es la que resulta de comparar con el mes anterior de la serie de 12 meses.
window.INFORME = {
  contacto: "#", // Enlace de «Quiero este servicio». Cambiar por la página de contacto de Zyro.
  serie: {
    etiquetas: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep"],
    clics: [205, 225, 218, 270, 300, 295, 345, 370, 362, 425, 456, 497],
    primerMes: "octubre de 2025"
  },
  meses: {
    julio: {
      nombre: "Julio", anterior: "junio", siguiente: "agosto", indice: 9,
      clics: 425, dClics: 17, impresiones: 18900, dImpresiones: 13, posicion: 8.2, dPosicion: 0.7, solicitudes: 14, dSolicitudes: 2,
      disponibilidad: "99,95", minutosCaidos: 22, copias: "31 de 31", actualizaciones: 6,
      busquedas: [
        ["reformas baño alicante", 115, 4.1, 0.6],
        ["reforma integral piso alicante", 86, 6.3, 0.4],
        ["presupuesto reforma cocina alicante", 62, 7.9, 1.2],
        ["cuánto cuesta reformar un baño", 51, 9.8, 0.3],
        ["reformas nova", 36, 1.1, 0],
        ["cambiar bañera por plato de ducha", 27, 10.4, 1.6]
      ],
      otrasBusquedas: 48,
      paginas: [
        ["/reformas-de-banos", "Reformas de baños", 148, 5.2],
        ["/reforma-integral", "Reforma integral de pisos", 97, 7.1],
        ["/blog/cuanto-cuesta-reformar-un-bano", "Cuánto cuesta reformar un baño", 71, 9.4],
        ["/", "Inicio", 63, 3.8],
        ["/reformas-de-cocinas", "Reformas de cocinas", 46, 8.6]
      ],
      hecho: [
        "Migración de la web a un servidor más rápido, con 22 minutos de parada de madrugada.",
        "Compresión de las 38 fotos de la galería de baños: la portada carga en 1,9 s.",
        "Corregidos 4 enlaces rotos hacia páginas que ya no existen."
      ],
      proximo: [
        ["Nueva página «Reforma de cocinas en Alicante»", "Agosto"],
        ["Responder a las 5 reseñas nuevas de Google", "Agosto"],
        ["Revisar títulos de las páginas de servicio", "Agosto"]
      ]
    },
    agosto: {
      nombre: "Agosto", anterior: "julio", siguiente: "septiembre", indice: 10,
      clics: 456, dClics: 7, impresiones: 20970, dImpresiones: 11, posicion: 7.5, dPosicion: 0.7, solicitudes: 17, dSolicitudes: 3,
      disponibilidad: "99,99", minutosCaidos: 4, copias: "31 de 31", actualizaciones: 4,
      busquedas: [
        ["reformas baño alicante", 128, 3.6, 0.5],
        ["reforma integral piso alicante", 90, 6.0, 0.3],
        ["presupuesto reforma cocina alicante", 66, 7.2, 0.7],
        ["cuánto cuesta reformar un baño", 55, 9.1, 0.7],
        ["reformas nova", 38, 1.1, 0],
        ["cambiar bañera por plato de ducha", 28, 9.7, 0.7]
      ],
      otrasBusquedas: 51,
      paginas: [
        ["/reformas-de-banos", "Reformas de baños", 160, 4.9],
        ["/reforma-integral", "Reforma integral de pisos", 104, 6.8],
        ["/reformas-de-cocinas", "Reformas de cocinas", 68, 7.9],
        ["/blog/cuanto-cuesta-reformar-un-bano", "Cuánto cuesta reformar un baño", 66, 9.0],
        ["/", "Inicio", 58, 3.7]
      ],
      hecho: [
        "Publicada la página de reformas de cocinas, que ya recibe 68 clics al mes.",
        "Respondidas las 5 reseñas nuevas de Google; la media sube a 4,8 sobre 5.",
        "Reescritos los títulos de las 6 páginas de servicio."
      ],
      proximo: [
        ["Artículo «Cómo preparar el piso antes de una reforma»", "Septiembre"],
        ["Añadir fotos de antes y después a la reforma integral", "Septiembre"],
        ["Revisar la velocidad en móvil", "Septiembre"]
      ]
    },
    septiembre: {
      nombre: "Septiembre", anterior: "agosto", siguiente: "octubre", indice: 11,
      clics: 497, dClics: 9, impresiones: 23700, dImpresiones: 13, posicion: 6.4, dPosicion: 1.1, solicitudes: 21, dSolicitudes: 4,
      disponibilidad: "99,98", minutosCaidos: 9, copias: "30 de 30", actualizaciones: 5,
      busquedas: [
        ["reformas baño alicante", 142, 3.2, 0.4],
        ["reforma integral piso alicante", 96, 5.4, 0.6],
        ["presupuesto reforma cocina alicante", 71, 6.1, 1.1],
        ["cuánto cuesta reformar un baño", 58, 8.2, 0.9],
        ["reformas nova", 44, 1.1, 0],
        ["cambiar bañera por plato de ducha", 31, 9.0, 0.7]
      ],
      otrasBusquedas: 55,
      paginas: [
        ["/reformas-de-banos", "Reformas de baños", 171, 4.5],
        ["/reforma-integral", "Reforma integral de pisos", 113, 6.1],
        ["/reformas-de-cocinas", "Reformas de cocinas", 79, 6.9],
        ["/blog/cuanto-cuesta-reformar-un-bano", "Cuánto cuesta reformar un baño", 72, 8.3],
        ["/blog/preparar-el-piso-antes-de-reformar", "Preparar el piso antes de reformar", 31, 11.2]
      ],
      hecho: [
        "Publicado el artículo sobre cómo preparar el piso antes de una reforma.",
        "Añadidas las fotos de antes y después a la reforma integral: sube el tiempo que pasan en la página.",
        "Velocidad en móvil: la portada pasa de 3,4 s a 2,1 s.",
        "Actualizados el gestor de contenidos y 4 complementos, sin incidencias."
      ],
      proximo: [
        ["Pedir reseñas a los clientes que terminaron obra en septiembre", "Octubre"],
        ["Nueva página «Reformas de locales comerciales»", "Octubre"],
        ["Revisar las búsquedas que están en la segunda página de Google", "Octubre"]
      ]
    }
  }
};
