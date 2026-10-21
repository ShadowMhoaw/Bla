// Lado izquierdo · canal "Asistente Web": lo que ve el cliente en el chat del taller.

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, CalendarPlus, CarFront, Clock, SendHorizontal, Tag, User, UserRound, Wrench } from 'lucide-react';
import { useDemo } from '../state/DemoContext.jsx';
import { useStickToBottom } from '../lib/useStickToBottom.js';
import { hhmm } from '../lib/format.js';
import Typewriter from './Typewriter.jsx';
import ChatCard from './ChatCards.jsx';

const ICONOS = { CalendarPlus, CarFront, Tag, Clock, UserRound };

function Burbuja({ m }) {
  const bot = m.role === 'bot';
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`flex items-end gap-2 ${bot ? '' : 'flex-row-reverse'}`}
    >
      <span className={`mb-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bot ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {bot ? <Bot className="h-4 w-4" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
      </span>
      <div className={`flex max-w-[82%] flex-col ${bot ? 'items-start' : 'items-end'}`}>
        <div
          className={`whitespace-pre-line px-3.5 py-2.5 text-[15px] leading-relaxed ${
            bot ? 'rounded-2xl rounded-bl-md bg-slate-100 text-slate-800' : 'rounded-2xl rounded-br-md bg-brand-700 text-white'
          }`}
        >
          <Typewriter text={m.text} startedAt={m.startedAt} speed={m.speed} done={m.done} />
        </div>
        {bot && m.done && <ChatCard tarjeta={m.tarjeta} />}
        <span className="mt-1 px-1 text-[11px] text-slate-400">{hhmm(m.startedAt)}</span>
      </div>
    </motion.div>
  );
}

function Escribiendo() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2" aria-label="El asistente está escribiendo">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white"><Bot className="h-4 w-4" aria-hidden="true" /></span>
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-400"
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatClient() {
  const { state, enviarWeb } = useDemo();
  const { mensajes, escribiendo, suggestions } = state.web;
  const ocupado = state.ocupado.web;
  const [texto, setTexto] = useState('');
  const { scrollRef, contentRef } = useStickToBottom();

  const enviar = (valor) => {
    if (ocupado || !valor.trim()) return;
    enviarWeb(valor);
    setTexto('');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      {/* Cabecera del chat */}
      <div className="flex items-center gap-3 bg-brand-900 px-4 py-3.5 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <Wrench className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">Taller Ronda</p>
          <p className="flex items-center gap-1.5 text-xs text-brand-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Asistente responde al momento
          </p>
        </div>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-white px-4 py-5" role="log" aria-label="Conversación con el asistente">
        <div ref={contentRef} className="space-y-4">
          <AnimatePresence initial={false}>
            {mensajes.map((m) => <Burbuja key={m.id} m={m} />)}
            {escribiendo && <Escribiendo key="escribiendo" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Respuestas rápidas + campo de texto */}
      <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3">
        <div className="mb-3 flex min-h-[34px] flex-wrap gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {suggestions.map((s, i) => {
              const Icono = ICONOS[s.icono];
              return (
                <motion.button
                  key={s.label}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: ocupado ? 0.5 : 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 420, damping: 30 }}
                  whileHover={ocupado ? undefined : { y: -1 }}
                  whileTap={ocupado ? undefined : { scale: 0.96 }}
                  disabled={ocupado}
                  onClick={() => enviar(s.texto ?? s.label)}
                  className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-left text-sm font-medium text-brand-700 transition-colors hover:border-brand-500 hover:bg-brand-50 disabled:hover:border-brand-200 disabled:hover:bg-white"
                >
                  {Icono && <Icono className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                  {s.label}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); enviar(texto); }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-3.5 pr-1.5 transition-colors focus-within:border-brand-500"
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            disabled={ocupado}
            placeholder={ocupado ? 'El asistente está contestando…' : 'Escribe tu mensaje…'}
            aria-label="Escribe tu mensaje"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={ocupado || !texto.trim()}
            aria-label="Enviar mensaje"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white transition-colors hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400"
          >
            <SendHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-slate-400">Respuestas generadas por IA · Demostración con datos de ejemplo</p>
      </div>
    </div>
  );
}
