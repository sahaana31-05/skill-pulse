import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#1B1D22', pulse: '#1FA764', mist: '#F6F7F9' },
      fontFamily: { sans: ['Manrope', 'ui-sans-serif', 'sans-serif'] }
    }
  },
  plugins: []
} satisfies Config;
