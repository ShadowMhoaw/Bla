// Datos de ejemplo (mock) de "Taller Ronda". Todo es ficticio: marcas, personas, matrículas y cifras.

export const TALLER = {
  nombre: 'Taller Ronda',
  direccion: 'Polígono El Fuerte, nave 7 · Ronda (Málaga)',
};

/** Contadores con los que arranca la jornada: la demo los hace subir en directo. */
export const KPIS_INICIALES = { consultas: 37, citas: 6, humano: 2 };

export const BIENVENIDA =
  'Buenos días. Soy el asistente de Taller Ronda. Puedo darte cita, decirte si tu coche está listo o resolver dudas de precios y horario. ¿En qué te ayudo?';

/** Botones rápidos (píldoras) que se ven debajo del chat. `icono` es el nombre del icono de Lucide. */
export const RESPUESTAS_RAPIDAS = [
  { label: 'Pedir cita', icono: 'CalendarPlus' },
  { label: '¿Está listo mi coche?', icono: 'CarFront' },
  { label: 'Precios', icono: 'Tag' },
  { label: 'Horario', icono: 'Clock' },
  { label: 'Hablar con una persona', icono: 'UserRound' },
];

export const HORARIO = [
  { dias: 'Lunes a viernes', horas: '8:30 – 14:00 · 16:00 – 19:30' },
  { dias: 'Sábados', horas: '9:00 – 13:00 (solo con cita)' },
  { dias: 'Domingos y festivos', horas: 'Cerrado' },
];

export const PRECIOS = [
  { servicio: 'Cambio de aceite y filtro', precio: 'desde 69 €' },
  { servicio: 'Pastillas de freno (eje delantero)', precio: 'desde 95 €' },
  { servicio: 'Revisión pre-ITV', precio: '39 €' },
  { servicio: 'Diagnosis electrónica', precio: '29 €' },
  { servicio: 'Alineado de dirección', precio: '35 €' },
  { servicio: 'Cambio de neumático (unidad)', precio: 'desde 12 €' },
];

/** Huecos libres del calendario según la franja que pide el cliente. */
export const SLOTS = {
  manana: ['09:00', '10:00', '12:30'],
  tarde: ['16:30', '17:30', '18:30'],
};

/** "Sistema de gestión del taller": órdenes de reparación por matrícula. */
export const VEHICULOS = {
  '4821 KLM': {
    orden: 'OR-1187',
    vehiculo: 'Ford Focus 1.5 TDCi',
    estado: 'listo',
    progreso: 100,
    trabajos: ['Cambio de aceite y filtro', 'Revisión de frenos'],
    importe: '112,40 €',
    nota: 'Puedes recogerlo hoy hasta las 19:30.',
  },
  '7733 HRT': {
    orden: 'OR-1192',
    vehiculo: 'Seat León 2.0 TDI',
    estado: 'en curso',
    progreso: 70,
    trabajos: ['Cambio de embrague', 'Revisión pre-ITV'],
    importe: '640,00 €',
    nota: 'Lo tendremos listo hoy sobre las 17:00. Te avisamos por SMS.',
  },
};

// Correlativo de citas para que cada cita creada en la demo tenga un número nuevo.
let ultimaCita = 2040;
export const nuevaCita = () => `#TR-${++ultimaCita}`;
export const reiniciarCitas = () => { ultimaCita = 2040; };

/** Mensajes de arranque de cada terminal (se escriben la primera vez que se abre el canal). */
export const LOGS_ARRANQUE = {
  web: [
    { text: 'taller-ronda-ai · motor conversacional v2.4', kind: 'sys' },
    { text: 'Canal Asistente Web conectado · base de conocimiento: 42 documentos', kind: 'sys' },
    { text: 'Calendario sincronizado · huecos libres esta semana: 14', kind: 'ok' },
    { text: 'Esperando mensajes del cliente…', kind: 'sys' },
  ],
  email: [
    { text: 'Buzón de entrada conectado (IMAP) · 4 mensajes sin leer', kind: 'sys' },
    { text: 'Reglas cargadas: cita · presupuesto · factura · reclamación', kind: 'sys' },
    { text: 'Esperando a que se procese la bandeja…', kind: 'sys' },
  ],
  voice: [
    { text: 'Centralita virtual conectada (SIP) · línea principal', kind: 'sys' },
    { text: 'Modelos de voz cargados: STT es-ES · TTS es-ES', kind: 'ok' },
    { text: 'Esperando llamadas entrantes…', kind: 'sys' },
  ],
};

export const CANALES = {
  web: 'Asistente web',
  email: 'Correo entrante',
  voice: 'Llamadas con IA',
};

/** Persona que llama en el simulador de voz (el número está parcialmente oculto). */
export const LLAMANTE = {
  nombre: 'Lucía Ortega',
  numero: '+34 6•• ••• 482',
  vehiculo: 'Seat León (2019)',
};

/* ─────────────────────────────────  CORREO  ───────────────────────────────── */

/** Categorías con sus colores de etiqueta (clases de Tailwind). */
export const CATEGORIAS = {
  cita: { label: 'Cita', clase: 'bg-brand-50 text-brand-700 ring-brand-200' },
  factura: { label: 'Factura', clase: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  presupuesto: { label: 'Presupuesto', clase: 'bg-amber-50 text-amber-700 ring-amber-200' },
  reclamacion: { label: 'Reclamación', clase: 'bg-red-50 text-red-700 ring-red-200' },
};

/**
 * Bandeja de ejemplo. `procesar({ dia })` devuelve lo que "decide" la IA para cada correo:
 * datos extraídos, acciones en el backend (con su efecto sobre los contadores) y el borrador de respuesta.
 */
export const CORREOS = [
  {
    id: 'm1',
    nombre: 'Marta López',
    iniciales: 'ML',
    asunto: 'Cita para la pre-ITV del Seat León',
    hora: '08:12',
    cuerpo:
      'Buenas, tengo que pasar la ITV el día 30 y me gustaría que me hicierais la revisión antes. Es un Seat León de 2016. Por las tardes me viene mejor. Gracias, Marta.',
    categoria: 'cita',
    prioridad: 'normal',
    confianza: '0.96',
    procesar: ({ dia }) => {
      const id = nuevaCita();
      return {
        extraido: { Vehículo: 'Seat León 2016', Servicio: 'Revisión pre-ITV', Preferencia: 'Tardes' },
        acciones: [
          { text: 'Consultando huecos de tarde en calendario…', kind: 'action' },
          { text: `Hueco libre: ${dia.corta} 17:30`, kind: 'data' },
          {
            text: `✔ Cita ${id} reservada · Marta López · Seat León · ${dia.corta} 17:30`,
            kind: 'ok',
            effect: { kpi: 'citas' },
          },
        ],
        borrador: `Hola, Marta:\n\nClaro que sí. Te he reservado la revisión pre-ITV del Seat León ${dia.rel} (${dia.corta}) a las 17:30. Son 39 € e incluye luces, frenos, emisiones y neumáticos.\n\nSi te viene mejor otro día, respóndeme a este correo y lo cambio.\n\nTaller Ronda`,
      };
    },
  },
  {
    id: 'm2',
    nombre: 'Recambios Serranía',
    iniciales: 'RS',
    asunto: 'Factura 2026-0417 · Pedido de pastillas y discos',
    hora: '08:40',
    cuerpo: 'Adjuntamos la factura 2026-0417 correspondiente al pedido del día 14. Vencimiento a 30 días. Un saludo.',
    adjunto: 'factura-2026-0417.pdf',
    categoria: 'factura',
    prioridad: 'baja',
    confianza: '0.99',
    procesar: () => ({
      extraido: { Proveedor: 'Recambios Serranía', 'Nº factura': '2026-0417', Importe: '1.284,60 €', Vencimiento: '30 días' },
      acciones: [
        { text: 'Leyendo PDF adjunto (OCR) · 1 página', kind: 'action' },
        { text: 'Importe coincide con el albarán A-882 ✔', kind: 'data' },
        { text: '✔ Reenviada a contabilidad · archivada en «Proveedores/2026»', kind: 'ok' },
      ],
      borrador: null,
    }),
  },
  {
    id: 'm3',
    nombre: 'Antonio Ruiz',
    iniciales: 'AR',
    asunto: 'Ruido al frenar, ¿cuánto me costaría?',
    hora: '09:03',
    cuerpo:
      'Mi Renault Clio de 2018 hace ruido al frenar y a veces vibra el volante. ¿Me podéis decir más o menos cuánto costaría arreglarlo? Gracias.',
    categoria: 'presupuesto',
    prioridad: 'normal',
    confianza: '0.94',
    procesar: () => ({
      extraido: { Vehículo: 'Renault Clio 2018', Síntoma: 'Ruido y vibración al frenar', 'Posible causa': 'Discos / pastillas' },
      acciones: [
        { text: 'Consultando tarifa: pastillas + discos delanteros (Clio)', kind: 'action' },
        { text: 'Estimación orientativa: 180 € – 260 € (mano de obra incluida)', kind: 'data' },
        { text: '✔ Presupuesto orientativo adjuntado al borrador', kind: 'ok' },
      ],
      borrador:
        'Hola, Antonio:\n\nPor lo que describes (ruido y vibración al frenar) lo más probable es que haya que cambiar pastillas y quizá discos. Para tu Renault Clio estaríamos entre 180 € y 260 €, mano de obra incluida.\n\nPara darte el precio exacto tenemos que verlo: la revisión de frenos es gratuita si luego haces la reparación con nosotros. ¿Te reservo cita?\n\nTaller Ronda',
    }),
  },
  {
    id: 'm4',
    nombre: 'Carmen Ortega',
    iniciales: 'CO',
    asunto: 'URGENTE: el testigo del motor sigue encendido',
    hora: '09:21',
    cuerpo:
      'Recogí el coche ayer después de la reparación y el testigo del motor sigue encendido. Es la segunda vez que me pasa. Quiero que alguien me llame hoy.',
    categoria: 'reclamacion',
    prioridad: 'alta',
    confianza: '0.98',
    procesar: () => ({
      extraido: { Cliente: 'Carmen Ortega', Motivo: 'Testigo del motor encendido tras reparación', Reincidencia: 'Sí (visita anterior hace 9 días)' },
      acciones: [
        { text: 'Tono detectado: molesto · reincidencia: sí', kind: 'warn' },
        { text: 'Regla: las reclamaciones no se responden sin supervisión', kind: 'info' },
        { text: '⚠ Derivado a Jorge (jefe de taller) · aviso por WhatsApp enviado', kind: 'warn', effect: { kpi: 'humano' } },
      ],
      borrador:
        'Hola, Carmen:\n\nLamentamos mucho lo ocurrido. Ya he avisado a Jorge, nuestro jefe de taller, y te llamará hoy antes de las 14:00. Si prefieres traer el coche esta misma mañana, lo revisamos sin coste.\n\nTaller Ronda',
    }),
  },
];
