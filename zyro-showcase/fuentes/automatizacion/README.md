# Taller Ronda · demo de automatización con IA (React)

Demo en pantalla dividida: a la izquierda lo que ve el cliente (blanco), a la derecha lo que hace la IA por detrás (oscuro).
Tres canales: **Asistente Web**, **Correo Entrante** y **Llamadas con IA (Voz)**. Todo son datos de ejemplo.

**Stack:** React 18 · Vite · Tailwind CSS 3 · Framer Motion · Lucide Icons (sin servidor ni APIs: todo es simulado).

```
npm install
npm run dev       # desarrollo
npm run build     # compila a ../../plantillas/automatizacion/ (se sube al repo; Vercel solo sirve archivos estáticos)
```

## Estructura
| Archivo | Qué hace |
| --- | --- |
| `src/App.jsx` | Layout 50/50 (apilado en móvil) y cambio de vista según el canal |
| `src/components/Header.jsx` | Título y pestañas de canal |
| `src/components/ChatClient.jsx` · `ChatCards.jsx` | Chat del cliente: burbujas, respuestas rápidas, input y tarjetas (precios, horario, cita, estado) |
| `src/components/EmailClient.jsx` | Bandeja de entrada: etiquetas, datos extraídos y borrador de respuesta |
| `src/components/VoiceSimulator.jsx` · `Waveform.jsx` | Pantalla de llamada, onda de audio animada y transcripción en vivo |
| `src/components/BackendMonitor.jsx` | KPIs y terminal de logs (lado derecho, común a los tres canales) |
| `src/components/Typewriter.jsx` | Efecto máquina de escribir |
| `src/state/DemoContext.jsx` | Estado compartido y motor de guiones |
| `src/scenarios/web.js` · `email.js` · `voice.js` | Guion de cada canal: qué responde la IA, qué escribe en el log y qué contador sube |
| `src/data/mock.js` | Textos, precios, horario, vehículos y correos de ejemplo |
| `src/lib/brain.js` | Reglas simples de "comprensión" para que el campo de texto del chat también funcione |

## Cómo está sincronizado
Cada mensaje del bot, línea del log o frase de la llamada es un elemento con `startedAt` y `speed`; el motor
(`DemoContext`) lo marca como terminado cuando acaba de "escribirse". Una línea de log puede llevar
`effect: { kpi: 'citas' }`: el contador sube justo cuando esa línea termina, así izquierda y derecha van a la vez.

Para añadir un caso nuevo basta con una función en `scenarios/` que use `api.log([...])`, `api.say(texto)` o `api.habla(...)`.

## Publicación
El sitio es estático: la carpeta `plantillas/automatizacion/` contiene el resultado ya compilado y es la que se publica
en `/plantillas/automatizacion/`. Tras cambiar algo en `src/`, ejecuta `npm run build` y sube también esa carpeta.
