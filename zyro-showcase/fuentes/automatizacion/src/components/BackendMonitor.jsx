// Lado derecho · "Lo que ocurre detrás": KPIs en directo y terminal con el razonamiento de la IA.

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Cpu, MessageSquare, UserRound } from 'lucide-react';
import { useDemo } from '../state/DemoContext.jsx';
import { CANALES } from '../data/mock.js';
import { useStickToBottom } from '../lib/useStickToBottom.js';
import { hhmmss } from '../lib/format.js';
import Typewriter from './Typewriter.jsx';

/* Color de cada tipo de línea del log (paleta oscura tipo GitHub) */
const COLOR = {
  sys: '#8b949e',
  info: '#c9d1d9',
  intent: '#79c0ff',
  data: '#e3b341',
  action: '#d2a8ff',
  ok: '#56d364',
  warn: '#ffa657',
};

/* ─────────────────────────────  KPIs  ───────────────────────────── */

function Kpi({ icono: Icono, label, valor, acento }) {
  const anterior = useRef(valor);
  const [suma, setSuma] = useState(0);

  // Al subir el contador aparece un "+1" verde un momento
  useEffect(() => {
    const subida = valor - anterior.current;
    anterior.current = valor;
    if (subida <= 0) { setSuma(0); return undefined; }
    setSuma((s) => s + subida);
    const t = setTimeout(() => setSuma(0), 1800);
    return () => clearTimeout(t);
  }, [valor]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border bg-white/[0.03] p-3.5"
      animate={{ borderColor: suma ? 'rgba(86,211,100,.55)' : 'rgba(255,255,255,.09)', boxShadow: suma ? '0 0 24px -4px rgba(86,211,100,.35)' : '0 0 0 rgba(0,0,0,0)' }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 text-[11px] font-medium leading-tight text-slate-400">
        <Icono className="h-3.5 w-3.5 shrink-0" style={{ color: acento }} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="relative mt-2 flex h-9 items-end gap-2">
        <div className="relative h-9 min-w-[2ch] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={valor}
              className="block text-3xl font-semibold leading-9 tabular-nums text-slate-50"
              style={{ textShadow: `0 0 18px ${acento}66` }}
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -22, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {valor}
            </motion.span>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {suma > 0 && (
            <motion.span
              key="suma"
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-1 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-300"
            >
              +{suma}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────  Terminal  ───────────────────────────── */

function Linea({ l }) {
  const color = COLOR[l.kind] ?? COLOR.info;
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex gap-2.5">
      <span className="hidden shrink-0 select-none text-[#484f58] sm:inline">{hhmmss(l.startedAt)}</span>
      <span className="shrink-0 select-none" style={{ color }}>&gt;</span>
      <span className="min-w-0 break-words" style={{ color, textShadow: `0 0 10px ${color}55` }}>
        <Typewriter text={l.text} startedAt={l.startedAt} speed={l.speed} done={l.done} />
      </span>
    </motion.div>
  );
}

export default function BackendMonitor() {
  const { state } = useDemo();
  const { kpis, canal } = state;
  const logs = state.logs[canal];
  const { scrollRef, contentRef } = useStickToBottom();
  const enEspera = logs.every((l) => l.done);

  return (
    <div className="flex h-full flex-col gap-4 text-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10"><Cpu className="h-4 w-4 text-sky-300" aria-hidden="true" /></span>
          <div>
            <h2 className="text-sm font-semibold leading-tight text-slate-100">Lo que ocurre detrás</h2>
            <p className="text-xs text-slate-500">Motor de IA · canal: {CANALES[canal]}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20">
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" /></span>
          En línea
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Kpi icono={MessageSquare} label="Consultas atendidas" valor={kpis.consultas} acento="#79c0ff" />
        <Kpi icono={CalendarCheck} label="Citas creadas" valor={kpis.citas} acento="#56d364" />
        <Kpi icono={UserRound} label="Pasadas a un humano" valor={kpis.humano} acento="#ffa657" />
      </div>

      {/* Terminal */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-night-500 bg-[#010409] shadow-[0_0_40px_-12px_rgba(86,211,100,.18)]">
        <div className="flex items-center gap-2 border-b border-night-600 bg-night-700 px-3.5 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-xs text-slate-500">taller-ronda-ai ~ logs / {canal}</span>
        </div>
        <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto p-4 font-mono text-[12.5px] leading-6" role="log" aria-label="Registro de acciones de la IA">
          <div ref={contentRef} className="space-y-0.5">
            {logs.map((l) => <Linea key={l.id} l={l} />)}
            {enEspera && (
              <div className="flex gap-2.5 text-[#56d364]">
                <span className="hidden w-[8ch] shrink-0 sm:inline" />
                <span>&gt;</span>
                <span className="mt-1 inline-block h-4 w-2 animate-blink bg-[#56d364]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
