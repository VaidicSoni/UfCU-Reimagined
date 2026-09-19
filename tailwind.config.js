/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Brand palette taken verbatim from the hackathon prompt's swatch sheet.
      colors: {
        navy: {
          subtle: '#CDCDE0',
          lighter: '#8182B1',
          DEFAULT: '#23335D',
          darker: '#020442',
          darkest: '#020332',
        },
        orange: {
          subtle: '#FCE1D2',
          lighter: '#F49A6A',
          DEFAULT: '#EF6820',
          darker: '#D14D10',
          darkest: '#693829',
        },
        amber: {
          subtle: '#FDEBDB',
          lighter: '#F6A055',
          DEFAULT: '#F2780C',
          darker: '#A95408',
          darkest: '#854207',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: {
        card: '0 20px 45px -20px rgba(2, 4, 66, 0.45)',
      },
    },
  },
  plugins: [],
}
