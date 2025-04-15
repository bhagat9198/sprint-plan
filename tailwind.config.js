/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode
        primary: '#4A90E2',
        success: '#34C759',
        warning: '#FF9500',
        critical: '#FF3B30',
        background: '#F7F8FA',
        card: '#FFFFFF',
        input: '#ECECEC',
        'text-primary': '#1D1D1D',
        'text-secondary': '#6C6C6C',
        'text-disabled': '#B3B3B3',
        
        // Dark Mode
        'dark-primary': '#4A90E2',
        'dark-success': '#30D158',
        'dark-warning': '#FFCC00',
        'dark-critical': '#FF453A',
        'dark-background': '#1D1E22',
        'dark-card': '#2A2B30',
        'dark-input': '#3B3C40',
        'dark-text-primary': '#FFFFFF',
        'dark-text-secondary': '#A8A8A8',
        'dark-text-disabled': '#5C5C5C',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'h1': '24px',
        'h2': '20px',
        'body': '16px',
        'small': '14px',
      },
      borderRadius: {
        'button': '12px',
        'input': '8px',
        'card': '8px',
      },
      padding: {
        'desktop': '24px',
        'tablet': '16px',
        'mobile': '12px',
      },
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1440px',
      },
      animation: {
        'scale-up': 'scale-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}