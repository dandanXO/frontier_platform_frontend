const { mergeConfig } = require('vite')
const svgSpritePlugin = require("vite-plugin-svg-sprite-component")

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          // When you have splitted your css over multiple files
          // and use @import('./other-styles.css')
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require('postcss'),
        },
      },
    },
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-vite"
  },
  features: {
    storyStoreV7: true
  },
  // https://github.com/storybookjs/builder-vite#customize-vite-config
  async viteFinal (config) {
    return mergeConfig(config, {
      plugins: [
        svgSpritePlugin.default({ symbolId: (name) => name })
      ],
    })
  }
}
