// Estado compartido de toda la demo (lado cliente + lado backend) y el "motor de guiones".
//
// Idea clave: todo lo que se "escribe" (mensajes del bot, líneas del log, transcripción) es un elemento con
// `startedAt` y `speed`. El efecto máquina de escribir es solo visual (ver components/Typewriter.jsx) y el propio
// motor marca el elemento como terminado cuando toca. Así los guiones avanzan igual aunque cambies de pestaña,
// y los contadores del backend suben justo cuando la línea que los provoca termina de escribirse.

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { CORREOS, KPIS_INICIALES, LOGS_ARRANQUE, BIENVENIDA, RESPUESTAS_RAPIDAS, reiniciarCitas } from '../data/mock';
import { turnoWeb } from '../scenarios/web';
import { procesarCorreo } from '../scenarios/email';
import { pasoLlamada } from '../scenarios/voice';

/* Milisegundos por carácter de cada tipo de texto */
const VELOCIDAD = { log: 4, chat: 13, voz: 22, borrador: 7 };

const ABORTAR = Symbol('abortar');
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const sinMovimiento = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let secuencia = 0;
const nuevoId = () => `it${++secuencia}`;

/* ─────────────────────────────  Estado inicial y reducer  ───────────────────────────── */

const estadoInicial = (canal = 'web') => ({
  canal,
  ocupado: { web: false, email: false, voice: false },
  kpis: { ...KPIS_INICIALES },
  logs: { web: [], email: [], voice: [] },
  web: { mensajes: [], escribiendo: false, suggestions: [], dialog: { stage: 'idle', data: {} } },
  email: {
    selectedId: CORREOS[0].id,
    correos: CORREOS.map((c) => ({ id: c.id, estado: 'nuevo', categoria: null, prioridad: null, extraido: null, borrador: null })),
  },
  voice: { phase: 'idle', speaker: null, thinking: false, transcript: [], startedAt: null, endedAt: null, resumen: null },
});

/** Marca como terminado un elemento (mensaje, línea de log, frase de la llamada o borrador) y aplica su efecto. */
function terminar(s, id) {
  const marcar = (lista) => lista.map((i) => (i.id === id ? { ...i, done: true } : i));
  for (const canal of Object.keys(s.logs)) {
    const linea = s.logs[canal].find((l) => l.id === id);
    if (!linea) continue;
    if (linea.done) return s;
    const kpis = linea.effect ? { ...s.kpis, [linea.effect.kpi]: s.kpis[linea.effect.kpi] + (linea.effect.n ?? 1) } : s.kpis;
    return { ...s, kpis, logs: { ...s.logs, [canal]: marcar(s.logs[canal]) } };
  }
  if (s.web.mensajes.some((m) => m.id === id)) return { ...s, web: { ...s.web, mensajes: marcar(s.web.mensajes) } };
  if (s.voice.transcript.some((m) => m.id === id)) return { ...s, voice: { ...s.voice, transcript: marcar(s.voice.transcript) } };
  if (s.email.correos.some((c) => c.borrador?.id === id)) {
    const correos = s.email.correos.map((c) => (c.borrador?.id === id ? { ...c, borrador: { ...c.borrador, done: true } } : c));
    return { ...s, email: { ...s.email, correos } };
  }
  return s;
}

function reducer(s, a) {
  switch (a.type) {
    case 'CANAL': return { ...s, canal: a.canal };
    case 'OCUPADO': return { ...s, ocupado: { ...s.ocupado, [a.canal]: a.valor } };
    case 'LOG': return { ...s, logs: { ...s.logs, [a.canal]: [...s.logs[a.canal], a.item] } };
    case 'MENSAJE': return { ...s, web: { ...s.web, mensajes: [...s.web.mensajes, a.item] } };
    case 'FRASE': return { ...s, voice: { ...s.voice, transcript: [...s.voice.transcript, a.item] } };
    case 'PARCHE': return { ...s, [a.slice]: { ...s[a.slice], ...a.parche } };
    case 'CORREO': return { ...s, email: { ...s.email, correos: s.email.correos.map((c) => (c.id === a.id ? { ...c, ...a.parche } : c)) } };
    case 'TERMINAR': return terminar(s, a.id);
    case 'REINICIAR': return estadoInicial(s.canal);
    default: return s;
  }
}

/* ─────────────────────────────  Proveedor  ───────────────────────────── */

const Ctx = createContext(null);
export const useDemo = () => useContext(Ctx);

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, 'web', estadoInicial);
  const stateRef = useRef(state);
  stateRef.current = state;

  const epoca = useRef(0); // sube al reiniciar: los guiones antiguos se abortan
  const cadenas = useRef({ web: Promise.resolve(), email: Promise.resolve(), voice: Promise.resolve() }); // un log por canal, en orden
  const corriendo = useRef({ web: false, email: false, voice: false });
  const arrancado = useRef({});

  /** API que reciben los guiones (ver scenarios/*.js). */
  const crearApi = useCallback((canal) => {
    const miEpoca = epoca.current;
    const viva = () => epoca.current === miEpoca;
    const guardia = () => { if (!viva()) throw ABORTAR; };
    const esperar = async (ms) => { await dormir(ms); guardia(); };
    let escribiendo = false;

    /** Añade un elemento y espera a que termine de "escribirse". */
    const escribir = async (anadir, texto, velocidad) => {
      const v = sinMovimiento() ? 0 : velocidad;
      const item = { id: nuevoId(), text: texto, startedAt: Date.now(), speed: v, done: false };
      anadir(item);
      await dormir(Math.ceil(texto.length * v));
      guardia();
      dispatch({ type: 'TERMINAR', id: item.id });
    };

    const api = {
      wait: esperar,
      estado: () => stateRef.current,
      patch: (slice, parche) => { guardia(); dispatch({ type: 'PARCHE', slice, parche }); },
      patchCorreo: (id, parche) => { guardia(); dispatch({ type: 'CORREO', id, parche }); },

      /** Escribe líneas en la terminal, una detrás de otra. Devuelve una promesa que se cumple al terminar la última. */
      log: (lineas, destino = canal) => {
        guardia();
        const tarea = async () => {
          for (const bruta of lineas) {
            if (!viva()) return;
            const l = typeof bruta === 'string' ? { text: bruta } : bruta;
            await dormir(l.pause ?? 140); // pequeña pausa de "pensando"
            if (!viva()) return;
            await escribir((item) => dispatch({ type: 'LOG', canal: destino, item: { ...item, kind: l.kind ?? 'info', effect: l.effect } }), l.text, VELOCIDAD.log);
          }
        };
        const p = cadenas.current[destino].then(tarea).catch(() => {});
        cadenas.current[destino] = p;
        return p;
      },

      /* — Chat web — */
      usuario: (texto) => {
        guardia();
        dispatch({ type: 'MENSAJE', item: { id: nuevoId(), role: 'user', text: texto, startedAt: Date.now(), speed: 0, done: true } });
      },
      escribiendo: (valor) => { guardia(); escribiendo = valor; dispatch({ type: 'PARCHE', slice: 'web', parche: { escribiendo: valor } }); },
      /** El bot contesta: tres puntitos y, después, el texto letra a letra. `tarjeta` añade una tarjeta rica bajo el texto. */
      say: async (texto, tarjeta = null, { indicador = true } = {}) => {
        guardia();
        if (indicador) {
          const yaEscribia = escribiendo;
          api.escribiendo(true);
          await esperar(yaEscribia ? 250 : 450 + Math.min(texto.length * 4, 600));
        }
        api.escribiendo(false);
        await escribir((item) => dispatch({ type: 'MENSAJE', item: { ...item, role: 'bot', tarjeta } }), texto, VELOCIDAD.chat);
      },

      /* — Correo — */
      borrador: async (id, texto) => {
        guardia();
        await escribir((item) => dispatch({ type: 'CORREO', id, parche: { borrador: item } }), texto, VELOCIDAD.borrador);
      },

      /* — Voz — */
      habla: async (quien, texto) => {
        guardia();
        dispatch({ type: 'PARCHE', slice: 'voice', parche: { speaker: quien, thinking: false } });
        await escribir((item) => dispatch({ type: 'FRASE', item: { ...item, who: quien } }), texto, VELOCIDAD.voz);
        dispatch({ type: 'PARCHE', slice: 'voice', parche: { speaker: null } });
        await esperar(250);
      },
    };
    return api;
  }, []);

  /** Ejecuta un guion marcando el canal como "ocupado" (deshabilita botones) mientras dura. */
  const ejecutar = useCallback(async (canal, guion) => {
    if (corriendo.current[canal]) return;
    corriendo.current[canal] = true;
    const miEpoca = epoca.current;
    dispatch({ type: 'OCUPADO', canal, valor: true });
    try {
      await guion(crearApi(canal));
    } catch (e) {
      if (e !== ABORTAR) console.error(e);
    } finally {
      if (epoca.current === miEpoca) {
        corriendo.current[canal] = false;
        dispatch({ type: 'OCUPADO', canal, valor: false });
      }
    }
  }, [crearApi]);

  /** Primera vez que se abre un canal: se escribe su arranque (y el saludo del bot en la web). */
  const arrancar = useCallback((canal) => {
    if (arrancado.current[canal]) return;
    arrancado.current[canal] = true;
    crearApi(canal).log(LOGS_ARRANQUE[canal]);
    if (canal === 'web') {
      ejecutar('web', async (api) => {
        await api.say(BIENVENIDA, null, { indicador: false });
        api.patch('web', { suggestions: RESPUESTAS_RAPIDAS });
      });
    }
  }, [crearApi, ejecutar]);

  useEffect(() => { arrancar(state.canal); }, [state.canal, arrancar]);

  const acciones = useMemo(() => {
    const reiniciar = () => {
      epoca.current += 1; // aborta los guiones en marcha
      cadenas.current = { web: Promise.resolve(), email: Promise.resolve(), voice: Promise.resolve() };
      corriendo.current = { web: false, email: false, voice: false };
      arrancado.current = {};
      reiniciarCitas();
      dispatch({ type: 'REINICIAR' });
      arrancar(stateRef.current.canal);
    };
    return {
      cambiarCanal: (canal) => dispatch({ type: 'CANAL', canal }),
      reiniciar,
      enviarWeb: (texto) => {
        const t = texto.trim();
        if (t) ejecutar('web', (api) => turnoWeb(api, t, stateRef.current.web.dialog));
      },
      seleccionarCorreo: (id) => dispatch({ type: 'PARCHE', slice: 'email', parche: { selectedId: id } }),
      procesarCorreo: (id) => ejecutar('email', (api) => procesarCorreo(api, id)),
      procesarBandeja: () =>
        ejecutar('email', async (api) => {
          for (const c of stateRef.current.email.correos) {
            if (c.estado === 'nuevo') await procesarCorreo(api, c.id);
          }
        }),
      avanzarLlamada: () => ejecutar('voice', (api) => pasoLlamada(api, stateRef.current.voice.phase)),
    };
  }, [ejecutar, arrancar]);

  const valor = useMemo(() => ({ state, ...acciones }), [state, acciones]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
