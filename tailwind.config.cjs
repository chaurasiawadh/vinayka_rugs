/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '430px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        cream: '#FAF8F6',
        'cream-dark': '#F3F1EF',
        terracotta: '#8B5E3C',
        'terracotta-dark': '#6D4A30',
        teal: '#0F4C5C',
        'teal-dark': '#0A3642',
        amber: '#D69E2E',
        'text-muted': '#4A4A4A',
        'text-body': '#222222',
        'text-subtle': '#7A7A7A',
        error: '#D23F3F',
        success: '#1E8F6E',
        'success-light': '#D1FAE5',
        'error-light': '#FEE2E2',
        border: '#E8E4E0',
        'border-light': '#F0ECE8',
        surface: '#FFFFFF',
        admin: {
          bg: '#111111',
          sidebar: '#1A1A1A',
          nav: '#242424',
        },
      },
      fontFamily: {
        primary: ['var(--font-primary)', 'Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', '"Space Grotesk"', 'sans-serif'],
        serif: ['var(--font-serif)', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['var(--font-primary)', 'Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10)',
        modal: '0 20px 48px rgba(0,0,0,0.15)',
        sidebar: '4px 0 20px rgba(0,0,0,0.08)',
        drawer: '-4px 0 24px rgba(0,0,0,0.12)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },
      maxWidth: {
        site: '1440px',
        content: '1280px',
        prose: '680px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
        'slide-in-left': 'slideInLeft 0.3s ease-out both',
        'slide-in-right': 'slideInRight 0.3s ease-out both',
        'fade-in-down': 'fadeInDown 0.2s ease-out both',
        'scale-in': 'scaleIn 0.2s ease-out both',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
