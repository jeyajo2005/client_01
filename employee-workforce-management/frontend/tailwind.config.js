/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          primary: '#1e3a8a', // Corporate Deep Navy Blue
          primaryLight: '#2563eb',
          primaryDark: '#172554',
          secondary: '#0ea5e9', // Ocean / Light Blue
          sky: '#38bdf8',
          accent: '#06b6d4',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          textMuted: '#64748b',
          textDark: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        'glow-primary': '0 0 20px -3px rgba(30, 58, 138, 0.25)',
        'glow-cyan': '0 0 20px -3px rgba(14, 165, 233, 0.3)',
      }
    },
  },
  plugins: [],
}
