/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Pastikan ini ada!
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        // PERBAIKAN WARNA DARK MODE
        darkBg: "#020617",    // Slate 950 (Sangat Gelap)
        darkCard: "#0F172A",  // Slate 900 (Gelap Sedikit Terang untuk Card)
        darkBorder: "#1E293B", // Slate 800 (Untuk Garis Tipis)
        
        // Brand Color (Tetap)
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.15)',
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};