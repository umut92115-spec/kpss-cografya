import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#d946ef',
          600: '#c026d3',
          900: '#701a75',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // KPSS platform renkleri (Retaining but improving)
        'kpss-turuncu': {
          DEFAULT: '#f97316',
          light:   '#ffedd5',
          dark:    '#7c2d12',
        },
        'kpss-sari': {
          DEFAULT: '#f59e0b',
          light:   '#fef3c7',
          dark:    '#78350f',
        },
        'harita-mavi': {
          DEFAULT: '#2563eb',
          light:   '#dbeafe',
          dark:    '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'premium': '0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)',
        'premium-hover': '0 0 0 1px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05), 0 24px 48px rgba(0,0,0,0.1)',
        'glass': 'inset 0 0 0 1px rgba(255,255,255,0.1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in':   'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float':     'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
