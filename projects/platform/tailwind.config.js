module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/ui-component/src/**/*.vue',
    '../../packages/platform/src/**/*.vue',
  ],
  plugins: require('@frontier/tailwindcss'),
}
