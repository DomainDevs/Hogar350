/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        basebg: '#e70022',
        secondbg: '#ffffff',
        text1: '#cbd5e1',
        text2: '#f1f5f9',
        orang: '#ff5500',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0f172a",             // botones, textos fuertes
          "primary-content": "#ffffff",

          "secondary": "#ffffff",           // cards, inputs
          "secondary-content": "#1f2937",

          "accent": "#cbd5e1",              // bordes suaves
          "accent-content": "#0f172a",

          "neutral": "#e2e8f0",             // neutro para bordes generales
          "neutral-content": "#1e293b",

          "base-100": "#f1f5f9",            // fondo principal (gris muy claro)
          "base-200": "#e2e8f0",            // fondo secundario
          "base-300": "#cbd5e1",            // hover o bordes suaves
          "base-content": "#1e293b",

          "info": "#3b82f6",                // azul
          "success": "#22c55e",             // verde
          "warning": "#eab308",             // amarillo fuerte
          "error": "#ef4444",               // rojo
          "brand-red": "#ff0044",
        },
      },
      {
        dark: {
          "primary": "#e2e8f0",
          "primary-content": "#0f172a",

          "secondary": "#1e293b",
          "secondary-content": "#e2e8f0",

          "accent": "#475569",
          "accent-content": "#f8fafc",

          "neutral": "#0f172a",
          "neutral-content": "#f3f4f6",

          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f8fafc",

          "info": "#38bdf8",
          "success": "#4ade80",
          "warning": "#fde047",
          "error": "#f87171",
          "brand-red": "#ff0044"
        },
      },

     // Nuevo Theme Light inspirado en Vueform
      {
        vueformLight: {
          "primary": "#64748b",
          "primary-content": "#ffffff",

          "secondary": "#f5f8fb",
          "secondary-content": "#334155",

          "accent": "#cbd5e1",
          "accent-content": "#1e293b",

          "neutral": "#e2e8f0",
          "neutral-content": "#1e293b",

          "base-100": "#f9fafb",
          "base-200": "#e5e7eb",
          "base-300": "#cbd5e1",
          "base-content": "#1e293b",

          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
          "brand-red": "#ff0044"
        },
      },
      // Nuevo Theme Dark inspirado en Vueform
      {
        vueformDark: {
          "primary": "#b0bec5",
          "primary-content": "#1e293b",

          "secondary": "#334155",
          "secondary-content": "#e5e7eb",

          "accent": "#475569",
          "accent-content": "#f9fafb",

          "neutral": "#1e293b",
          "neutral-content": "#f3f4f6",

          "base-100": "#131a24",
          "base-200": "#1f293b",
          "base-300": "#2e3a4a",
          "base-content": "#f9f9f9",

          "info": "#38bdf8",
          "success": "#4ade80",
          "warning": "#fde047",
          "error": "#f87171",
           "brand-red": "#ff0044"
        },
      },

    ],
  },
};
