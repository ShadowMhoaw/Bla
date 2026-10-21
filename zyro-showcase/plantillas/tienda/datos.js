/* Olmo · datos de ejemplo. Los importes van en céntimos para no arrastrar errores de coma flotante. */
(function () {
  "use strict";
  var O = (window.Olmo = window.Olmo || {});

  O.CONFIG = {
    envioGratisDesde: 3500, // 35 €
    gastosEnvio: 490,       // 4,90 € por debajo del umbral
    descuentoSuscripcion: 0.15,
    maxPorLinea: 10,
  };

  O.MOLIENDAS = [
    { id: "grano", nombre: "En grano", nota: "Para moler en casa: la máxima frescura" },
    { id: "italiana", nombre: "Cafetera italiana", nota: "Molienda media-fina" },
    { id: "prensa", nombre: "Prensa francesa", nota: "Molienda gruesa" },
    { id: "filtro", nombre: "Filtro o V60", nota: "Molienda media" },
    { id: "espresso", nombre: "Espresso", nota: "Molienda fina para máquina" },
  ];

  O.FRECUENCIAS = [
    { id: 2, nombre: "Cada 2 semanas" },
    { id: 4, nombre: "Cada 4 semanas" },
    { id: 6, nombre: "Cada 6 semanas" },
  ];

  var U = "https://images.unsplash.com/photo-";
  O.img = function (id, ancho) { return U + id + "?auto=format&fit=crop&q=70&w=" + ancho; };

  O.PRODUCTOS = [
    {
      id: "etiopia-yirgacheffe", nombre: "Etiopía Yirgacheffe", origen: "Yirgacheffe, Etiopía · Lavado",
      notas: ["Jazmín", "Melocotón", "Cítricos"], precio: 1390, peso: "250 g", intensidad: 2,
      uso: ["filtro"], tipo: "cafe", etiqueta: "Novedad", foto: "1587734195503-904fca47e0e9",
      alt: "Granos de café de especialidad en un cuenco blanco",
    },
    {
      id: "colombia-huila", nombre: "Colombia Huila", origen: "Huila, Colombia · Caturra",
      notas: ["Caramelo", "Manzana roja", "Cacao"], precio: 1290, peso: "250 g", intensidad: 3,
      uso: ["filtro", "espresso"], tipo: "cafe", etiqueta: "Más vendido", foto: "1447933601403-0c6688de566e",
      alt: "Granos de café recién tostado",
    },
    {
      id: "brasil-cerrado", nombre: "Brasil Cerrado", origen: "Cerrado Mineiro, Brasil · Natural",
      notas: ["Chocolate con leche", "Avellana", "Naranja"], precio: 1190, peso: "250 g", intensidad: 4,
      uso: ["espresso"], tipo: "cafe", etiqueta: "", foto: "1514432324607-a09d9b4aefdd",
      alt: "Taza de espresso con crema densa vista desde arriba",
    },
    {
      id: "kenia-nyeri", nombre: "Kenia Nyeri AA", origen: "Nyeri, Kenia · Lavado",
      notas: ["Grosella negra", "Pomelo", "Panela"], precio: 1590, peso: "250 g", intensidad: 3,
      uso: ["filtro"], tipo: "cafe", etiqueta: "Edición limitada", foto: "1559496417-e7f25cb247f3",
      alt: "Vaso de café con luz natural y sombras de hojas",
    },
    {
      id: "pack-degustacion", nombre: "Pack de degustación", origen: "3 orígenes · 3 × 100 g",
      notas: ["Floral", "Afrutado", "Achocolatado"], precio: 1990, peso: "300 g", intensidad: 3,
      uso: ["filtro", "espresso"], tipo: "pack", etiqueta: "Ideal para empezar", foto: "1498804103079-a6351b050096",
      alt: "Mesa redonda con varias tazas de café para una cata",
    },
  ];

  O.producto = function (id) {
    for (var i = 0; i < O.PRODUCTOS.length; i++) if (O.PRODUCTOS[i].id === id) return O.PRODUCTOS[i];
    return null;
  };
  O.moliendaPorId = function (id) {
    for (var i = 0; i < O.MOLIENDAS.length; i++) if (O.MOLIENDAS[i].id === id) return O.MOLIENDAS[i];
    return null;
  };
  /* Precio unitario según la modalidad de compra */
  O.precioUnidad = function (p, modo) {
    return modo === "suscripcion" ? Math.round(p.precio * (1 - O.CONFIG.descuentoSuscripcion)) : p.precio;
  };
})();
