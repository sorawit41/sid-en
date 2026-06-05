/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We can still support it, but default is light
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', 
        surface: 'var(--surface)', 
        card: 'var(--card)',
        card2: 'var(--card2)',
        border: 'var(--border)', 
        border2: 'var(--border2)',
        borderHover: 'var(--border-hover)',
        accent: 'var(--accent)', 
        accentHover: 'var(--accent-hover)',
        text: 'var(--text)', 
        muted: 'var(--muted)', 
        dim: 'var(--dim)',
        good: 'var(--good)', 
        bad: 'var(--bad)', 
        warn: 'var(--warn)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'default': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
