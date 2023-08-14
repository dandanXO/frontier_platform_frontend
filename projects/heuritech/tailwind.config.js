module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/ui-component/src/**/*.vue',
    '../../packages/3d-viewer/src/**/*.vue',
  ],
  plugins: [require('@frontier/tailwindcss')],
  theme: {
    extend: {
      colors: {
        heuritech: '#BC8E4E',
      },
    },
  },
}
