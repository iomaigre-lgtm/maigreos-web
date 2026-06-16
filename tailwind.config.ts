import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#C1FF72',
        'accent-2': '#7ED957',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        glass: '20px',
        card: '16px',
        pill: '14px',
        item: '10px',
      },
    },
  },
  plugins: [],
}
export default config
