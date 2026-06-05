import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        matte: '#050608',
        panel: 'rgba(12, 16, 22, 0.72)',
        cyan: {
          soft: '#67e8f9',
          DEFAULT: '#22d3ee',
        },
        violet: {
          soft: '#c4b5fd',
          DEFAULT: '#8b5cf6',
        },
      },
      boxShadow: {
        glow: '0 0 32px rgba(34, 211, 238, 0.14)',
        violetGlow: '0 0 28px rgba(139, 92, 246, 0.16)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
