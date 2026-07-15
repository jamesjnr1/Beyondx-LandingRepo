/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // Clean cool-neutral off-whites (faint green-grey tint to harmonise with brand green)
        cream: {
          50: '#fafbf8',
          100: '#f2f5ee',
          200: '#e6ebdf',
          300: '#d2dac6',
          400: '#b4c0a3',
        },
        // BeyondX Green — anchored on #6BAB21 (brand primary = forest-600)
        forest: {
          300: '#a6d96a',
          400: '#8bc53f',
          500: '#7bbb2e',
          600: '#6bab21', // BeyondX Green (brand)
          700: '#578c1a',
          800: '#446d14',
          900: '#33520f',
        },
        // Secondary accent — a brighter lime-green so underlines/accents read
        // distinctly against solid brand-green buttons (keeps the brand 2-tone)
        clay: {
          300: '#b7e07a',
          400: '#8bc53f',
          500: '#7bbb2e',
          600: '#578c1a',
        },
        // BeyondX Dark — anchored on #12180E (brand dark = ink-900)
        ink: {
          600: '#3a4235',
          700: '#2a3226',
          800: '#1e2419',
          900: '#12180e', // BeyondX Dark (brand)
          950: '#0b0f08',
        },
      },
    },
  },
  plugins: [],
}
