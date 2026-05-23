import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
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
        focus: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
        },
        glow: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        paper: {
          50: '#FEFDFB',
          100: '#FBF9F6',
          200: '#F5F0EB',
          300: '#EDE5DC',
        },
        'harita-mavi': {
          DEFAULT: '#2563eb',
          light:   '#dbeafe',
          dark:    '#1e3a8a',
        },
        academic: {
          mavi: '#4B7BA7',
          turuncu: '#E8823C',
          yesil: '#2D8659',
          kirmizi: '#C84C42',
          gri: '#F5F5F5',
          koyu: '#2C2C2C',
        },
        'kpss-kirmizi': {
          bg: '#FFE5E5',
          border: '#C84C42',
        },
        'kpss-turuncu-box': {
          bg: '#FFF3E5',
          border: '#E8823C',
        },
        'kpss-yesil': {
          bg: '#E5F5E5',
          border: '#2D8659',
        },
        'kpss-mavi': {
          bg: '#E5F0FF',
          border: '#4B7BA7',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(59, 130, 246, 0.05), 0 10px 15px -3px rgba(59, 130, 246, 0.05), 0 20px 40px rgba(59, 130, 246, 0.03)',
        'premium-hover': '0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 20px 50px -10px rgba(37, 99, 235, 0.08)',
        'card': '0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03)',
        'card-hover': '0 4px 12px rgba(15,23,42,0.06), 0 12px 28px rgba(15,23,42,0.05)',
        'glass': 'inset 0 0 0 1px rgba(255,255,255,0.1)',
        'glow': '0 0 20px rgba(251,191,36,0.15)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in':     'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in-up':  'fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft':  'pulse-soft 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
