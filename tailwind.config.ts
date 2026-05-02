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
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        },
        // KPSS platform renkleri
        'kpss-turuncu': {
          DEFAULT: '#C2410C',
          light:   '#FED7AA',
          dark:    '#7C2D12',
        },
        'kpss-sari': {
          DEFAULT: '#B45309',
          light:   '#FEF3C7',
          dark:    '#78350F',
        },
        'kpss-koyu': {
          DEFAULT: '#0F172A',
          soft:    '#1E293B',
          muted:   '#334155',
        },
        'harita-mavi': {
          DEFAULT: '#1D4ED8',
          light:   '#BFDBFE',
          dark:    '#1E3A8A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in':   'fade-in 0.3s ease-out both',
        'slide-down': 'slide-down 0.25s ease-out both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
