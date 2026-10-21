/* Datos de ejemplo de «Reformas Nova». Todo es inventado.
   Fuente única de verdad: las cifras de los KPI, sus variaciones y los CTR se calculan desde `serie`,
   así que nunca pueden contradecirse entre sí. Hay un informe por cada mes de octubre de 2025 a septiembre de 2026
   (los clics de búsquedas y páginas de cada mes nunca superan el total de ese mes).
   En producción este objeto vendría de Search Console o de una API, uno por cliente. */
window.INFORME = {
  agencia: "Zyro",
  dominio: "reformasnova.example",
  contacto: "#", // Página de contacto de Zyro. Mientras sea «#», el botón de contacto lleva al formulario de este informe.

  // Octubre de 2025 a septiembre de 2026
  etiquetas: ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep"],
  etiquetasLargas: ["Oct 2025", "Nov 2025", "Dic 2025", "Ene 2026", "Feb 2026", "Mar 2026", "Abr 2026", "May 2026", "Jun 2026", "Jul 2026", "Ago 2026", "Sep 2026"],
  nombresMes: ["Octubre", "Noviembre", "Diciembre", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
  serie: {
    clics:        [205, 225, 218, 270, 300, 295, 345, 370, 362, 425, 456, 497],
    impresiones:  [9800, 10900, 10700, 12900, 14000, 13800, 15600, 16500, 16800, 18900, 20970, 23700],
    posicion:     [12.1, 11.8, 11.9, 11.0, 10.4, 10.5, 9.8, 9.6, 8.9, 8.2, 7.5, 6.4],
    solicitudes:  [6, 7, 6, 8, 9, 8, 10, 11, 12, 14, 17, 21],
    // Septiembre de 2025, el mes anterior al primero del informe: sirve de punto de partida para las variaciones
    base: { clics: 190, impresiones: 9300, posicion: 12.5, solicitudes: 5 }
  },

  // Una posición entre 11 y OPORTUNIDAD_MAX se marca con una estrella como «Cerca del Top 10»
  oportunidadMax: 13,

  informes: {
    "2025-10": {
      anio: 2025, mes: 10, nombre: "Octubre", siguiente: "noviembre", indice: 0,
      mantenimiento: { disponibilidad: 99.97, minutosCaidos: 13, copias: [31, 31], actualizaciones: [5, 5] },
      busquedas: [
        { q: "reformas baño alicante", clics: 55, pos: 6.8, mejora: 0 },
        { q: "reforma integral piso alicante", clics: 41, pos: 9.4, mejora: 0 },
        { q: "presupuesto reforma cocina alicante", clics: 30, pos: 11.4, mejora: 0 },
        { q: "cuánto cuesta reformar un baño", clics: 25, pos: 12.9, mejora: 0 },
        { q: "reformas nova", clics: 17, pos: 1.1, mejora: 0 },
        { q: "cambiar bañera por plato de ducha", clics: 13, pos: 13.9, mejora: 0 },
        { q: "ideas reforma baño pequeño", clics: 7, pos: 18.6, mejora: 0 },
        { q: "empresa de reformas en alicante", clics: 5, pos: 17.1, mejora: 0 },
        { q: "reforma cocina abierta al salón", clics: 3, pos: 19.5, mejora: 0 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 67, pos: 8.3 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 44, pos: 10.2 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 32, pos: 12.5 },
        { url: "/", titulo: "Inicio", clics: 29, pos: 5.0 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 20, pos: 11.9 }
      ],
      hecho: [
        { dia: "6 oct", texto: "Auditoría técnica completa de la web: 62 puntos revisados y 14 problemas encontrados." },
        { dia: "13 oct", texto: "Conectada la web a Google Search Console para medir clics, impresiones y posición." },
        { dia: "27 oct", texto: "Corregidos los títulos duplicados y enviado el mapa del sitio a Google." }
      ],
      proximo: [
        { texto: "Reescribir las fichas de reformas de baños y de reforma integral", cuando: "Noviembre" },
        { texto: "Reducir el peso de las imágenes de la portada", cuando: "Noviembre" },
        { texto: "Crear la ficha de empresa en Google", cuando: "Noviembre" }
      ],
      sugerencia: "Da una página propia a cada servicio: ahora casi todas las búsquedas acaban en la portada."
    },
    "2025-11": {
      anio: 2025, mes: 11, nombre: "Noviembre", siguiente: "diciembre", indice: 1,
      mantenimiento: { disponibilidad: 99.99, minutosCaidos: 4, copias: [30, 30], actualizaciones: [3, 3] },
      busquedas: [
        { q: "reformas baño alicante", clics: 61, pos: 6.6, mejora: 0.2 },
        { q: "reforma integral piso alicante", clics: 46, pos: 9.2, mejora: 0.2 },
        { q: "presupuesto reforma cocina alicante", clics: 33, pos: 11.1, mejora: 0.3 },
        { q: "cuánto cuesta reformar un baño", clics: 27, pos: 12.7, mejora: 0.2 },
        { q: "reformas nova", clics: 19, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 14, pos: 13.6, mejora: 0.3 },
        { q: "ideas reforma baño pequeño", clics: 8, pos: 18.3, mejora: 0.3 },
        { q: "empresa de reformas en alicante", clics: 6, pos: 16.8, mejora: 0.3 },
        { q: "reforma cocina abierta al salón", clics: 4, pos: 19.2, mejora: 0.3 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 73, pos: 8.1 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 49, pos: 10.0 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 35, pos: 12.3 },
        { url: "/", titulo: "Inicio", clics: 32, pos: 4.9 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 22, pos: 11.7 }
      ],
      hecho: [
        { dia: "3 nov", texto: "Reescritas las fichas de reformas de baños y de reforma integral, con precios orientativos y fotos reales." },
        { dia: "12 nov", texto: "Imágenes de la portada reducidas: la carga baja de 5,2 s a 3,9 s." },
        { dia: "24 nov", texto: "Creada la ficha de empresa en Google, con fotos y horario." }
      ],
      proximo: [
        { texto: "Publicar el artículo «Cuánto cuesta reformar un baño»", cuando: "Diciembre" },
        { texto: "Pedir las primeras reseñas a clientes recientes", cuando: "Diciembre" },
        { texto: "Preparar un plan de contenidos para el primer trimestre", cuando: "Diciembre" }
      ],
      sugerencia: "Publica una guía de precios de reformas de baño: es lo que más busca la gente antes de pedir presupuesto."
    },
    "2025-12": {
      anio: 2025, mes: 12, nombre: "Diciembre", siguiente: "enero", indice: 2,
      mantenimiento: { disponibilidad: 99.82, minutosCaidos: 80, copias: [30, 31], actualizaciones: [4, 4] },
      busquedas: [
        { q: "reformas baño alicante", clics: 59, pos: 6.7, mejora: -0.1 },
        { q: "reforma integral piso alicante", clics: 44, pos: 9.3, mejora: -0.1 },
        { q: "presupuesto reforma cocina alicante", clics: 32, pos: 11.2, mejora: -0.1 },
        { q: "cuánto cuesta reformar un baño", clics: 26, pos: 12.8, mejora: -0.1 },
        { q: "reformas nova", clics: 18, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 14, pos: 13.7, mejora: -0.1 },
        { q: "ideas reforma baño pequeño", clics: 8, pos: 18.4, mejora: -0.1 },
        { q: "empresa de reformas en alicante", clics: 6, pos: 16.9, mejora: -0.1 },
        { q: "reforma cocina abierta al salón", clics: 4, pos: 19.3, mejora: -0.1 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 71, pos: 8.2 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 47, pos: 10.1 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 34, pos: 12.4 },
        { url: "/", titulo: "Inicio", clics: 31, pos: 4.9 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 21, pos: 11.8 }
      ],
      hecho: [
        { dia: "2 dic", texto: "Publicado el artículo «Cuánto cuesta reformar un baño», el primero del blog." },
        { dia: "9 dic", texto: "Incidencia del proveedor de alojamiento: la web estuvo 80 minutos sin servicio y una copia de seguridad falló. Todo se repitió y se comprobó el mismo día." },
        { dia: "16 dic", texto: "Conseguidas las 4 primeras reseñas en Google." }
      ],
      proximo: [
        { texto: "Activar la vigilancia de la web las 24 horas", cuando: "Enero" },
        { texto: "Ampliar el contenido de «Reforma integral»", cuando: "Enero" },
        { texto: "Revisar los enlaces rotos de la web", cuando: "Enero" }
      ],
      sugerencia: "Activa la vigilancia de la web las 24 horas: la incidencia de este mes costó visitas y conviene detectarla al momento."
    },
    "2026-01": {
      anio: 2026, mes: 1, nombre: "Enero", siguiente: "febrero", indice: 3,
      mantenimiento: { disponibilidad: 99.98, minutosCaidos: 9, copias: [31, 31], actualizaciones: [6, 6] },
      busquedas: [
        { q: "reformas baño alicante", clics: 73, pos: 6.1, mejora: 0.6 },
        { q: "reforma integral piso alicante", clics: 55, pos: 8.5, mejora: 0.8 },
        { q: "presupuesto reforma cocina alicante", clics: 39, pos: 10.4, mejora: 0.8 },
        { q: "cuánto cuesta reformar un baño", clics: 32, pos: 12.0, mejora: 0.8 },
        { q: "reformas nova", clics: 23, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 17, pos: 12.9, mejora: 0.8 },
        { q: "ideas reforma baño pequeño", clics: 10, pos: 17.5, mejora: 0.9 },
        { q: "empresa de reformas en alicante", clics: 7, pos: 16.1, mejora: 0.8 },
        { q: "reforma cocina abierta al salón", clics: 4, pos: 18.4, mejora: 0.9 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 88, pos: 7.4 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 58, pos: 9.3 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 42, pos: 11.6 },
        { url: "/", titulo: "Inicio", clics: 38, pos: 4.6 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 26, pos: 11.0 }
      ],
      hecho: [
        { dia: "8 ene", texto: "Activada la vigilancia de la web las 24 horas, con aviso inmediato al equipo." },
        { dia: "15 ene", texto: "Ampliado el contenido de «Reforma integral»: de 400 a 1.100 palabras, con preguntas frecuentes." },
        { dia: "28 ene", texto: "Corregidos 9 enlaces rotos y 3 páginas sin título." }
      ],
      proximo: [
        { texto: "Añadir fotos de proyectos terminados con su descripción", cuando: "Febrero" },
        { texto: "Mejorar la velocidad en móvil", cuando: "Febrero" },
        { texto: "Pedir reseñas a los clientes de enero", cuando: "Febrero" }
      ],
      sugerencia: "Añade una galería de proyectos con texto: las fotos con descripción ayudan a salir en búsquedas de ideas."
    },
    "2026-02": {
      anio: 2026, mes: 2, nombre: "Febrero", siguiente: "marzo", indice: 4,
      mantenimiento: { disponibilidad: 99.99, minutosCaidos: 4, copias: [28, 28], actualizaciones: [3, 3] },
      busquedas: [
        { q: "reformas baño alicante", clics: 81, pos: 5.6, mejora: 0.5 },
        { q: "reforma integral piso alicante", clics: 61, pos: 8.1, mejora: 0.4 },
        { q: "presupuesto reforma cocina alicante", clics: 44, pos: 9.9, mejora: 0.5 },
        { q: "cuánto cuesta reformar un baño", clics: 36, pos: 11.6, mejora: 0.4 },
        { q: "reformas nova", clics: 25, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 19, pos: 12.4, mejora: 0.5 },
        { q: "ideas reforma baño pequeño", clics: 11, pos: 16.9, mejora: 0.6 },
        { q: "empresa de reformas en alicante", clics: 8, pos: 15.6, mejora: 0.5 },
        { q: "reforma cocina abierta al salón", clics: 5, pos: 17.8, mejora: 0.6 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 97, pos: 7.0 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 65, pos: 8.9 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 47, pos: 11.2 },
        { url: "/", titulo: "Inicio", clics: 42, pos: 4.5 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 29, pos: 10.6 }
      ],
      hecho: [
        { dia: "4 feb", texto: "Creada la página de proyectos, con 12 reformas terminadas, fotos y descripción." },
        { dia: "17 feb", texto: "Mejorada la velocidad en móvil: la portada baja de 3,9 s a 3,4 s." },
        { dia: "24 feb", texto: "Enviado a los clientes de enero el enlace para dejar su reseña." }
      ],
      proximo: [
        { texto: "Optimizar títulos y descripciones de las páginas de servicio", cuando: "Marzo" },
        { texto: "Revisar la ficha de Google antes de primavera", cuando: "Marzo" },
        { texto: "Estudiar las búsquedas sobre cocinas", cuando: "Marzo" }
      ],
      sugerencia: "Estudia las búsquedas sobre cocinas: hay demanda y todavía no tienes una página para ellas."
    },
    "2026-03": {
      anio: 2026, mes: 3, nombre: "Marzo", siguiente: "abril", indice: 5,
      mantenimiento: { disponibilidad: 99.96, minutosCaidos: 18, copias: [31, 31], actualizaciones: [5, 5] },
      busquedas: [
        { q: "reformas baño alicante", clics: 80, pos: 5.7, mejora: -0.1 },
        { q: "reforma integral piso alicante", clics: 60, pos: 8.1, mejora: 0.0 },
        { q: "presupuesto reforma cocina alicante", clics: 43, pos: 10.0, mejora: -0.1 },
        { q: "cuánto cuesta reformar un baño", clics: 35, pos: 11.6, mejora: 0.0 },
        { q: "reformas nova", clics: 25, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 19, pos: 12.5, mejora: -0.1 },
        { q: "ideas reforma baño pequeño", clics: 10, pos: 17.0, mejora: -0.1 },
        { q: "empresa de reformas en alicante", clics: 8, pos: 15.7, mejora: -0.1 },
        { q: "reforma cocina abierta al salón", clics: 5, pos: 17.9, mejora: -0.1 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 96, pos: 7.0 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 64, pos: 8.9 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 46, pos: 11.2 },
        { url: "/", titulo: "Inicio", clics: 42, pos: 4.5 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 28, pos: 10.6 }
      ],
      hecho: [
        { dia: "3 mar", texto: "Revisados los títulos y descripciones de las páginas de servicio para que se entiendan mejor en Google." },
        { dia: "14 mar", texto: "Actualizada la ficha de Google con los servicios de primavera y 8 fotos nuevas." },
        { dia: "26 mar", texto: "Estudiadas 40 búsquedas relacionadas con cocinas: hay demanda en Alicante." }
      ],
      proximo: [
        { texto: "Redactar el artículo sobre los plazos de una reforma integral", cuando: "Abril" },
        { texto: "Revisar los enlaces internos entre servicios", cuando: "Abril" },
        { texto: "Actualizar el gestor de contenidos y los complementos", cuando: "Abril" }
      ],
      sugerencia: "Enlaza entre sí las páginas de baños, cocinas e integral: ayuda a Google a entender tu web."
    },
    "2026-04": {
      anio: 2026, mes: 4, nombre: "Abril", siguiente: "mayo", indice: 6,
      mantenimiento: { disponibilidad: 99.98, minutosCaidos: 9, copias: [30, 30], actualizaciones: [4, 4] },
      busquedas: [
        { q: "reformas baño alicante", clics: 93, pos: 5.2, mejora: 0.5 },
        { q: "reforma integral piso alicante", clics: 70, pos: 7.6, mejora: 0.5 },
        { q: "presupuesto reforma cocina alicante", clics: 50, pos: 9.3, mejora: 0.7 },
        { q: "cuánto cuesta reformar un baño", clics: 41, pos: 11.1, mejora: 0.5 },
        { q: "reformas nova", clics: 29, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 22, pos: 11.8, mejora: 0.7 },
        { q: "ideas reforma baño pequeño", clics: 12, pos: 16.3, mejora: 0.7 },
        { q: "empresa de reformas en alicante", clics: 9, pos: 15.0, mejora: 0.7 },
        { q: "reforma cocina abierta al salón", clics: 6, pos: 17.2, mejora: 0.7 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 112, pos: 6.5 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 75, pos: 8.4 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 54, pos: 10.7 },
        { url: "/", titulo: "Inicio", clics: 49, pos: 4.3 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 33, pos: 10.1 }
      ],
      hecho: [
        { dia: "6 abr", texto: "Publicado el artículo «Cuánto tarda una reforma integral»." },
        { dia: "16 abr", texto: "Añadidos enlaces entre las páginas de servicio, con textos claros." },
        { dia: "28 abr", texto: "Actualizados el gestor de contenidos y 3 complementos, sin incidencias." }
      ],
      proximo: [
        { texto: "Pedir reseñas tras las obras de abril", cuando: "Mayo" },
        { texto: "Medir las solicitudes de presupuesto desde cada página", cuando: "Mayo" },
        { texto: "Mejorar las imágenes de la galería", cuando: "Mayo" }
      ],
      sugerencia: "Mide de qué página llega cada solicitud de presupuesto: así sabrás dónde conviene invertir más."
    },
    "2026-05": {
      anio: 2026, mes: 5, nombre: "Mayo", siguiente: "junio", indice: 7,
      mantenimiento: { disponibilidad: 99.99, minutosCaidos: 4, copias: [31, 31], actualizaciones: [6, 6] },
      busquedas: [
        { q: "reformas baño alicante", clics: 100, pos: 5.1, mejora: 0.1 },
        { q: "reforma integral piso alicante", clics: 75, pos: 7.4, mejora: 0.2 },
        { q: "presupuesto reforma cocina alicante", clics: 54, pos: 9.2, mejora: 0.1 },
        { q: "cuánto cuesta reformar un baño", clics: 44, pos: 10.9, mejora: 0.2 },
        { q: "reformas nova", clics: 31, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 24, pos: 11.7, mejora: 0.1 },
        { q: "ideas reforma baño pequeño", clics: 13, pos: 16.1, mejora: 0.2 },
        { q: "empresa de reformas en alicante", clics: 10, pos: 14.9, mejora: 0.1 },
        { q: "reforma cocina abierta al salón", clics: 6, pos: 17.0, mejora: 0.2 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 120, pos: 6.3 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 80, pos: 8.2 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 57, pos: 10.5 },
        { url: "/", titulo: "Inicio", clics: 52, pos: 4.2 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 36, pos: 9.9 }
      ],
      hecho: [
        { dia: "5 may", texto: "Instalada la medición de solicitudes de presupuesto en cada página." },
        { dia: "13 may", texto: "Conseguidas 6 reseñas nuevas en Google: la media sube a 4,7 sobre 5." },
        { dia: "27 may", texto: "Reordenada la galería de proyectos para que cargue antes." }
      ],
      proximo: [
        { texto: "Revisar la web en móviles antiguos", cuando: "Junio" },
        { texto: "Actualizar los textos de la portada", cuando: "Junio" },
        { texto: "Preparar la migración a un servidor más rápido", cuando: "Junio" }
      ],
      sugerencia: "Prepara el cambio a un servidor más rápido: la velocidad es hoy lo que más frena tu posición."
    },
    "2026-06": {
      anio: 2026, mes: 6, nombre: "Junio", siguiente: "julio", indice: 8,
      mantenimiento: { disponibilidad: 99.97, minutosCaidos: 13, copias: [30, 30], actualizaciones: [4, 4] },
      busquedas: [
        { q: "reformas baño alicante", clics: 98, pos: 4.6, mejora: 0.5 },
        { q: "reforma integral piso alicante", clics: 73, pos: 6.9, mejora: 0.5 },
        { q: "presupuesto reforma cocina alicante", clics: 53, pos: 8.5, mejora: 0.7 },
        { q: "cuánto cuesta reformar un baño", clics: 43, pos: 10.4, mejora: 0.5 },
        { q: "reformas nova", clics: 31, pos: 1.1, mejora: 0.0 },
        { q: "cambiar bañera por plato de ducha", clics: 23, pos: 11.0, mejora: 0.7 },
        { q: "ideas reforma baño pequeño", clics: 13, pos: 15.4, mejora: 0.7 },
        { q: "empresa de reformas en alicante", clics: 9, pos: 14.2, mejora: 0.7 },
        { q: "reforma cocina abierta al salón", clics: 6, pos: 16.3, mejora: 0.7 }
      ],
      paginas: [
        { url: "/reformas-de-banos", titulo: "Reformas de baños", clics: 118, pos: 5.8 },
        { url: "/reforma-integral", titulo: "Reforma integral de pisos", clics: 78, pos: 7.7 },
        { url: "/blog/cuanto-cuesta-reformar-un-bano", titulo: "Cuánto cuesta reformar un baño", clics: 56, pos: 10.0 },
        { url: "/", titulo: "Inicio", clics: 51, pos: 4.0 },
        { url: "/proyectos", titulo: "Proyectos y galería", clics: 35, pos: 9.4 }
      ],
      hecho: [
        { dia: "2 jun", texto: "Probada la web en 6 móviles distintos y corregidos 2 fallos de diseño." },
        { dia: "12 jun", texto: "Actualizados los textos de la portada con los servicios y las zonas donde trabajas." },
        { dia: "25 jun", texto: "Preparada la migración a un servidor más rápido, con copia completa de la web." }
      ],
      proximo: [
        { texto: "Migrar la web a un servidor más rápido", cuando: "Julio" },
        { texto: "Comprimir las imágenes de la galería de baños", cuando: "Julio" },
        { texto: "Corregir los enlaces rotos", cuando: "Julio" }
      ],
      sugerencia: "Cambia a un servidor más rápido y comprime las imágenes: es la mejora con más efecto en tu posición ahora mismo."
    },
    "2026-07": {
      anio: 2026, mes: 7, nombre: "Julio", siguiente: "agosto", indice: 9,
      mantenimiento: { disponibilidad: 99.95, minutosCaidos: 22, copias: [31, 31], actualizaciones: [6, 6] },
      busquedas: [
        { q: "reformas baño alicante", clics: 115, pos: 4.1, mejora: 0.5 },
        { q: "reforma integral piso alicante", clics: 86, pos: 6.3, mejora: 0.6 },
        { q: "presupuesto reforma cocina alicante", clics: 62, pos: 7.9, mejora: 0.6 },
        { q: "cuánto cuesta reformar un baño", clics: 51, pos: 9.8, mejora: 0.6 },
        { q: "reformas nova", clics: 36, pos: 1.1, mejora: 0 },
        { q: "cambiar bañera por plato de ducha", clics: 27, pos: 10.4, mejora: 0.6 },
        { q: "ideas reforma baño pequeño", clics: 15, pos: 14.7, mejora: 0.7 },
        { q: "empresa de reformas en alicante", clics: 11, pos: 13.6, mejora: 0.6 },
        { q: "reforma cocina abierta al salón", clics: 7, pos: 15.6, mejora: 0.7 }
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
    "2026-08": {
      anio: 2026, mes: 8, nombre: "Agosto", siguiente: "septiembre", indice: 10,
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
    "2026-09": {
      anio: 2026, mes: 9, nombre: "Septiembre", siguiente: "octubre", indice: 11,
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
