/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict monochrome-first hierarchy
        void: '#050505',
        surface: {
          DEFAULT: '#0A0A0A',
          card: '#121212',
          panel: 'rgba(20, 20, 20, 0.75)',
          muted: '#1A1A1A',
          border: '#262626',
          'border-light': '#383838',
        },
        ghost: {
          light: '#F5F5F5',
          DEFAULT: '#E5E5E5',
          dim: '#A3A3A3',
          dark: '#737373',
          faint: '#404040'
        },
        // Unique signature accent: Tamra / Solarized Phosphor
        tamra: {
          DEFAULT: '#FF5500',
          hover: '#FF6A1A',
          glow: 'rgba(255, 85, 0, 0.25)',
          subtle: 'rgba(255, 85, 0, 0.08)',
          tint: '#331505',
          border: 'rgba(255, 85, 0, 0.4)'
        },
        // Diagnostic Status LEDs
        led: {
          green: '#00FF66',
          'green-dim': '#003314',
          amber: '#FFB800',
          'amber-dim': '#332400',
          red: '#FF2A2A',
          'red-dim': '#330505',
          cyan: '#00E5FF'
        }
      },
      fontFamily: {
        dot: ['"Silkscreen"', 'monospace'],
        display: ['"Space Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
        'cross-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '20px 20px',
        'cross-grid': '40px 40px',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.2s steps(2, start) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
