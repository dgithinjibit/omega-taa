/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#aeb6c6',
          400: '#818da4',
          500: '#626e87',
          600: '#4d566c',
          700: '#3f4658',
          800: '#363c4a',
          900: '#0d1017',
          950: '#070a0f',
        },
        brand: {
          50: '#eefcf5',
          100: '#d6f7e8',
          200: '#b0eed4',
          300: '#7adfb8',
          400: '#3ec996',
          500: '#18b07e',
          600: '#0d8f66',
          700: '#0d7253',
          800: '#0e5b44',
          900: '#0d4b39',
        },
        accent: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdaff',
          300: '#8ec1ff',
          400: '#599dff',
          500: '#347aff',
          600: '#1d5bf5',
          700: '#1746e1',
          800: '#193ab6',
          900: '#1a388f',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'flow': 'flow 2.5s ease-in-out infinite',
        'trace': 'trace 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        flow: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(8px)' },
        },
        trace: {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
