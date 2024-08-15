const { mergeConfig } = require('vite')
const svgSpritePlugin = require('vite-plugin-svg-sprite-component')
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-styling',
    'storybook-addon-vue-slots',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  // https://github.com/storybookjs/builder-vite#customize-vite-config
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        svgSpritePlugin.default({
          symbolId: (name) => name,
        }),
      ],
    })
  },
  docs: {
    autodocs: false,
  },
}
