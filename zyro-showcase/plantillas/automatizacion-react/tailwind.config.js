/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Azul corporativo del taller (cabeceras y acentos del lado cliente)
        brand: {
          50: '#eef4ff',
          100: '#dbe8ff',
          200: '#bcd3fd',
          500: '#2f6fe0',
          600: '#1f58c2',
          700: '#17458f',
          800: '#10336b',
          900: '#0a2250',
        },
        // Paleta "GitHub dark" del lado backend
        night: {
          900: '#0d1117',
          800: '#10151c',
          700: '#161b22',
          600: '#21262d',
          500: '#30363d',
        },
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } },
        ring: { '0%': { transform: 'scale(.9)', opacity: 0.55 }, '100%': { transform: 'scale(2)', opacity: 0 } },
        shake: {
          '0%, 100%': { transform: 'rotate(0)' },
          '15%, 45%, 75%': { transform: 'rotate(-14deg)' },
          '30%, 60%, 90%': { transform: 'rotate(14deg)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        ring: 'ring 1.8s cubic-bezier(.2,.6,.3,1) infinite',
        shake: 'shake 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
