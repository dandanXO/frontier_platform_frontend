/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/ui-component/src/**/*.vue',
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@frontier/tailwindcss'),
  ],
}
