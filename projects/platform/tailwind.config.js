module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/ui-component/src/**/*.vue',
    '../../projects/3d-viewer/src/**/*.vue'
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@frontier/tailwindcss')
  ],
}
