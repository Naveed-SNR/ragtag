/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#00eaff',
          200: '#00caff',
          },
        background: ['var(--background)'],
        foreground: ['var(--foreground)'],
        accent: ['var(--accent)'],
        off:['fefefe']
      },


      
    },
  },
  plugins: [],
}