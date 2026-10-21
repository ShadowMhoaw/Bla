import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' → el build se puede servir desde cualquier subruta (p. ej. /plantillas/automatizacion/)
export default defineConfig({
  base: './',
  plugins: [react()],
});
