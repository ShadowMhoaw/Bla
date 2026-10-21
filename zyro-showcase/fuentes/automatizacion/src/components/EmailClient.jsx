// Lado izquierdo · canal "Correo Entrante": bandeja de entrada que la IA clasifica, responde y archiva.

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Archive, Inbox, Loader2, Paperclip, Reply, Sparkles } from 'lucide-react';
import { useDemo } from '../state/DemoContext.jsx';
import { CATEGORIAS, CORREOS } from '../data/mock.js';
import { useStickToBottom } from '../lib/useStickToBottom.js';
import Typewriter from './Typewriter.jsx';

function Etiqueta({ categoria }) {
  const c = CATEGORIAS[categoria];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${c.clase}`}
    >
      {c.label}
    </motion.span>
  );
}

export default function EmailClient() {
  const { state, seleccionarCorreo, procesarCorreo, procesarBandeja } = useDemo();
  const ocupado = state.ocupado.email;
  const { selectedId, correos } = state.email;
  const pendientes = correos.filter((c) => c.estado === 'nuevo').length;
  const mail = CORREOS.find((c) => c.id === selectedId);
  const estado = correos.find((c) => c.id === selectedId);

  // Mientras la IA analiza y redacta, el panel baja solo para que se vea el borrador escribiéndose
  const trabajando = estado.estado === 'procesando' || (!!estado.borrador && !estado.borrador.done);
  const { scrollRef, contentRef } = useStickToBottom(trabajando);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [selectedId, scrollRef]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      <div className="flex items-center gap-3 bg-brand-900 px-4 py-3.5 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15"><Inbox className="h-5 w-5" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">Bandeja de entrada</p>
          <p className="text-xs text-brand-100">Taller Ronda · {pendientes} sin procesar</p>
        </div>
        <button
          type="button"
          onClick={procesarBandeja}
          disabled={ocupado || pendientes === 0}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium ring-1 ring-white/15 transition-colors hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Procesar bandeja</span><span className="sm:hidden">Todo</span>
        </button>
      </div>

      {/* Lista de correos */}
      <ul className="scroll-thin max-h-[42%] shrink-0 divide-y divide-slate-100 overflow-y-auto border-b border-slate-200">
        {CORREOS.map((c) => {
          const e = correos.find((x) => x.id === c.id);
          const activo = c.id === selectedId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => seleccionarCorreo(c.id)}
                aria-current={activo}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${activo ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">{c.iniciales}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${e.estado === 'nuevo' ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{c.nombre}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{c.hora}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13px] text-slate-500">{c.asunto}</span>
                    {e.categoria && <Etiqueta categoria={e.categoria} />}
                    {e.estado === 'procesando' && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-brand-500" aria-label="Procesando" />}
                  </span>
                </span>
                {e.estado === 'nuevo' && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-label="Sin procesar" />}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Detalle del correo seleccionado + resultado de la IA */}
      <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div ref={contentRef}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={mail.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <h3 className="text-base font-semibold leading-snug text-slate-900">{mail.asunto}</h3>
              <p className="mt-0.5 text-xs text-slate-500">De {mail.nombre} · {mail.hora}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{mail.cuerpo}</p>
              {mail.adjunto && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                  <Paperclip className="h-3.5 w-3.5" aria-hidden="true" /> {mail.adjunto}
                </span>
              )}

              {estado.estado === 'nuevo' && (
                <button
                  type="button"
                  onClick={() => procesarCorreo(mail.id)}
                  disabled={ocupado}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {ocupado ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
                  {ocupado ? 'La IA está procesando…' : 'Procesar con IA'}
                </button>
              )}

              {estado.estado !== 'nuevo' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" /> Análisis de la IA
                    {estado.categoria && <Etiqueta categoria={estado.categoria} />}
                    {estado.prioridad === 'alta' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[11px] text-white"><AlertTriangle className="h-3 w-3" aria-hidden="true" /> Prioridad alta</span>
                    )}
                  </div>
                  {estado.extraido && (
                    <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-2">
                      {Object.entries(estado.extraido).map(([k, v]) => (
                        <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="font-medium text-slate-800">{v}</dd></div>
                      ))}
                    </dl>
                  )}
                  {estado.borrador && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Reply className="h-3.5 w-3.5" aria-hidden="true" /> Borrador de respuesta</p>
                      <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">
                        <Typewriter text={estado.borrador.text} startedAt={estado.borrador.startedAt} speed={estado.borrador.speed} done={estado.borrador.done} />
                      </p>
                    </div>
                  )}
                  {estado.estado === 'listo' && !estado.borrador && (
                    <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-emerald-700"><Archive className="h-4 w-4" aria-hidden="true" /> Sin respuesta necesaria · archivado automáticamente</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
