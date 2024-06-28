require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue-pug/vue3-recommended',
    'plugin:cypress/recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      files: [
        '*.cjs',
        '.eslintrc.js',
        'vite.config.js',
        'tailwind.config.js',
        'postcss.config.js',
        'packages/tailwindcss/index.js',
      ],
      env: { node: true },
    },
  ],
  rules: {
    curly: ['error', 'all'],
  },
}
