// Pantalla dividida 50/50: izquierda = lo que ve el cliente (blanco), derecha = lo que hace la IA detrás (oscuro).
// En móvil las dos mitades se apilan. El canal activo cambia solo la mitad izquierda; el backend refleja siempre el mismo estado.

import { AnimatePresence, motion } from 'framer-motion';
import { DemoProvider, useDemo } from './state/DemoContext.jsx';
import Header from './components/Header.jsx';
import ChatClient from './components/ChatClient.jsx';
import EmailClient from './components/EmailClient.jsx';
import VoiceSimulator from './components/VoiceSimulator.jsx';
import BackendMonitor from './components/BackendMonitor.jsx';

const VISTAS = { web: ChatClient, email: EmailClient, voice: VoiceSimulator };

function Escena() {
  const { state } = useDemo();
  const Vista = VISTAS[state.canal];
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="bg-black px-4 py-2 text-center text-xs text-neutral-300">
        Demostración de automatización con IA <span className="mx-1.5 text-neutral-600">·</span> Taller, personas y cifras de ejemplo
      </div>
      <Header />
      <main className="grid flex-1 lg:grid-cols-2">
        {/* Lado izquierdo: cliente */}
        <section className="relative min-h-[660px] bg-white lg:min-h-[640px]" aria-label="Lo que ve el cliente">
          <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.canal}
                className="mx-auto h-full max-w-[640px]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <Vista />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        {/* Lado derecho: backend */}
        <section className="relative min-h-[620px] bg-night-900 lg:min-h-[640px]" aria-label="Lo que hace la IA por detrás">
          <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
            <BackendMonitor />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <Escena />
    </DemoProvider>
  );
}
