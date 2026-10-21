/* Solo para regenerar tailwind.css (ver LEEME.md). Vercel sirve el CSS ya compilado: no hay build en el despliegue. */
module.exports = {
  content: ["./index.html", "./*.js"],
  theme: {
    extend: {
      colors: {
        crema: "#FAF8F5",
        arena: "#F1EBE1",
        linea: "#E6DED2",
        carbon: "#1A1A1A",
        cafe: { DEFAULT: "#9A5A2B", claro: "#D9A36E", oscuro: "#6F3F1B" },
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "Cambria", "serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      transitionTimingFunction: { suave: "cubic-bezier(.32,.72,0,1)" },
    },
  },
};
