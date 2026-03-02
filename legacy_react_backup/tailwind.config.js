export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elegant: {
          white: '#F9FAFB', // Porcelain / Off-white
          navy: '#111827', // Deep Navy (Primary Text)
          gold: '#D4AF37', // Muted Gold (Accents)
          gray: '#F3F4F6', // Light Gray (Secondary Backgrounds)
          dark: '#1F2937', // Dark Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Share Tech Mono', 'monospace'], // Keep for technical data if needed
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'soft-scale': 'softScale 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        }
      },
      backgroundImage: {
        'gradient-mesh': "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)",
        'subtle-gradient': "linear-gradient(to bottom right, #F9FAFB, #F3F4F6)",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
