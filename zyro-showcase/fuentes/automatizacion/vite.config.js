import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' → el build se puede servir desde cualquier subruta.
// El resultado se escribe en plantillas/automatizacion/, que es lo que publica el sitio estático (sin paso de compilación en Vercel).
export default defineConfig({
  base: './',
  build: { outDir: '../../plantillas/automatizacion', emptyOutDir: true },
  plugins: [react()],
});
