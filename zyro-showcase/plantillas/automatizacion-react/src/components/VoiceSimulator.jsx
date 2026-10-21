// Lado izquierdo · canal "Llamadas con IA (Voz)": pantalla de llamada con onda de audio y transcripción en vivo.
// Flujo en 3 clics: llamada entrante → el cliente pide cita para los frenos → el cliente acepta el hueco.

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, CalendarCheck, CheckCircle2, Loader2, Mic, Phone, PhoneIncoming, PhoneOff, RotateCcw, User } from 'lucide-react';
import { useDemo } from '../state/DemoContext.jsx';
import { LLAMANTE } from '../data/mock.js';
import { useStickToBottom } from '../lib/useStickToBottom.js';
import { mmss } from '../lib/format.js';
import Typewriter from './Typewriter.jsx';
import Waveform from './Waveform.jsx';

/** Cronómetro de la llamada: corre mientras no haya `fin`. */
function useDuracion(inicio, fin) {
  const [ahora, setAhora] = useState(Date.now());
  useEffect(() => {
    if (!inicio || fin) return undefined;
    const t = setInterval(() => setAhora(Date.now()), 500);
    return () => clearInterval(t);
  }, [inicio, fin]);
  return inicio ? ((fin ?? ahora) - inicio) / 1000 : 0;
}

/* Texto del botón principal según la fase de la llamada */
const ACCIONES = {
  idle: { label: 'Simular llamada entrante', icono: PhoneIncoming, paso: 0 },
  greeted: { label: 'El cliente pide cita para los frenos', icono: User, paso: 1 },
  proposed: { label: 'El cliente acepta el hueco', icono: User, paso: 2 },
  ended: { label: 'Nueva llamada', icono: RotateCcw, paso: 3 },
};
const PASOS = ['Llamada entrante', 'Pide cita', 'IA confirma'];

export default function VoiceSimulator() {
  const { state, avanzarLlamada } = useDemo();
  const { phase, speaker, thinking, transcript, startedAt, endedAt, resumen } = state.voice;
  const ocupado = state.ocupado.voice;
  const segundos = useDuracion(startedAt, endedAt);
  const { scrollRef, contentRef } = useStickToBottom();

  const sonando = phase === 'ringing';
  const enLlamada = !!startedAt && !endedAt;
  const accion = ACCIONES[phase];
  const AccionIcono = accion?.icono;
  const progreso = phase === 'ended' ? 3 : phase === 'proposed' ? 2 : phase === 'idle' ? 0 : 1;

  const estado = sonando
    ? 'Llamada entrante…'
    : enLlamada
      ? `En llamada · ${mmss(segundos)}`
      : phase === 'ended'
        ? `Llamada finalizada · ${mmss(segundos)}`
        : 'Sin llamadas activas';
  const quien = speaker === 'ia' ? 'Asistente IA hablando…' : speaker === 'client' ? 'Cliente hablando…' : thinking ? 'Asistente IA analizando…' : enLlamada ? 'Línea en silencio' : '';

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      {/* Pantalla de llamada */}
      <div className="relative overflow-hidden bg-gradient-to-b from-brand-900 to-brand-800 px-5 pb-4 pt-5 text-white">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            {sonando && (
              <>
                <span className="absolute inset-0 animate-ring rounded-full border border-sky-300" />
                <span className="absolute inset-0 animate-ring rounded-full border border-sky-300 [animation-delay:.9s]" />
              </>
            )}
            {speaker && (
              <motion.span
                className={`absolute inset-0 rounded-full ${speaker === 'ia' ? 'bg-sky-300/30' : 'bg-white/25'}`}
                animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <span
              className={`relative flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-white/20 ${
                phase === 'ended' ? 'bg-red-500/80' : enLlamada || sonando ? 'bg-emerald-500' : 'bg-white/10'
              }`}
            >
              {phase === 'ended' ? (
                <PhoneOff className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Phone className={`h-6 w-6 ${sonando ? 'animate-shake' : ''}`} aria-hidden="true" />
              )}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-tight">{enLlamada || phase === 'ended' ? LLAMANTE.nombre : sonando ? LLAMANTE.numero : 'Centralita IA · Taller Ronda'}</p>
            <p className="text-sm text-brand-100">{enLlamada || phase === 'ended' ? LLAMANTE.numero : sonando ? 'Línea principal' : 'Atiende cada llamada, también fuera de horario'}</p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-sky-200" aria-live="polite">{estado}</p>
          </div>
        </div>

        <Waveform speaker={speaker} thinking={thinking} className="mt-3" />
        <p className="h-5 text-center text-xs font-medium text-sky-100/80">{quien}</p>
      </div>

      {/* Transcripción en vivo */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="relative flex h-2 w-2">
              {enLlamada && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${enLlamada ? 'bg-red-500' : 'bg-slate-300'}`} />
            </span>
            Transcripción en vivo
          </p>
          <span className="text-xs text-slate-400">es-ES · tiempo real</span>
        </div>

        <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-4" role="log" aria-label="Transcripción de la llamada">
          <div ref={contentRef} className="space-y-3.5">
            {transcript.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-slate-400">
                <Mic className="h-6 w-6" aria-hidden="true" />
                La transcripción aparecerá aquí cuando la IA conteste la llamada.
              </div>
            )}
            {transcript.map((t) => {
              const ia = t.who === 'ia';
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} className="flex gap-3">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ia ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {ia ? <Bot className="h-4 w-4" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">{ia ? 'Asistente IA' : LLAMANTE.nombre}</p>
                    <p className="text-[15px] leading-relaxed text-slate-800">
                      <Typewriter text={t.text} startedAt={t.startedAt} speed={t.speed} done={t.done} />
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {resumen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/60">
                <p className="flex items-center gap-2 px-3.5 pt-3 text-[13px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Cita creada por la IA
                  <span className="ml-auto font-mono text-xs font-medium">{resumen.id}</span>
                </p>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3.5 pb-3 pt-1.5 text-[13px] text-slate-700">
                  <span className="flex items-center gap-1.5 font-semibold"><CalendarCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />{resumen.dia} · {resumen.hora}</span>
                  <span>{resumen.vehiculo}</span>
                  <span>{resumen.servicio}</span>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Control de la simulación */}
      <div className="border-t border-slate-100 px-5 pb-4 pt-3">
        <ol className="mb-3 flex items-center gap-2" aria-label="Progreso de la simulación">
          {PASOS.map((p, i) => (
            <li key={p} className="flex flex-1 flex-col gap-1">
              <span className={`h-1 rounded-full transition-colors duration-500 ${i < progreso ? 'bg-brand-600' : 'bg-slate-200'}`} />
              <span className={`text-[11px] ${i < progreso ? 'font-semibold text-brand-700' : 'text-slate-400'}`}>{p}</span>
            </li>
          ))}
        </ol>
        {accion ? (
          <button
            type="button"
            onClick={avanzarLlamada}
            disabled={ocupado}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:bg-slate-100 disabled:text-slate-400 ${
              phase === 'idle' || phase === 'ended' ? 'bg-brand-700 text-white hover:bg-brand-600' : 'border border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100'
            }`}
          >
            {ocupado ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <AccionIcono className="h-4 w-4" aria-hidden="true" />}
            {ocupado ? (sonando ? 'Sonando…' : 'La IA está atendiendo…') : accion.label}
          </button>
        ) : (
          <button type="button" disabled className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {sonando ? 'Sonando…' : 'La IA está atendiendo…'}
          </button>
        )}
      </div>
    </div>
  );
}
