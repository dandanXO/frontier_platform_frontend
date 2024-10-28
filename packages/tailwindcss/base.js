const defaultLightTheme = (theme) => ({
  '--color-disabled': theme('colors.grey.400.v1'),
  '--color-critical': theme('colors.red.50.v1'),
  '--color-critical-hover': theme('colors.red.100.v1'),
  '--color-critical-border': theme('colors.red.200.v1'),
  '--color-critical-solid': theme('colors.red.500.v1'),
  '--color-primary': theme('colors.white'),
  '--color-primary-inverse': theme('colors.black'),
  '--color-secondary': theme('colors.grey.50.v1'),
  '--color-secondary-border': theme('colors.grey.100.v1'),
  '--color-secondary-text': theme('colors.grey.700.v1'),
  '--color-tertiary': theme('colors.grey.100.v1'),
})

// expected to used module.export, if using export default
// it will crash the storybook
// eslint-disable-next-line no-undef
module.exports = function ({ addBase, theme }) {
  addBase({
    ':root': {
      '--color-brand': theme('colors.primary.400'),
      '--color-brand-border': theme('colors.grey.150'),
      '--color-brand-solid': theme('colors.primary.400'),
      '--color-brand-solid-hover': theme('colors.primary.500'),
      '--color-critical': theme('colors.red.50.v1'),
      '--color-critical-hover': theme('colors.red.100.v1'),
      '--color-critical-border': theme('colors.red.200.v1'),
      '--color-critical-solid': theme('colors.red.500.v1'),
      '--color-link': theme('colors.primary.400'),
      '--color-link-hover': theme('colors.primary.500'),
      '--color-primary': theme('colors.grey.0'),
      '--color-primary-inverse': theme('colors.grey.900'),
      '--color-secondary': theme('colors.grey.900'),
      '--color-secondary-border': theme('colors.grey.250'),
      '--color-secondary-text': theme('colors.grey.900'),
      '--color-tertiary': theme('colors.grey.100'),
      '--color-disabled': theme('colors.grey.250'),
    },

    '[data-theme="new"]': {
      '--color-brand': theme('colors.green.100'),
      '--color-brand-border': theme('colors.green.200.v1'),
      '--color-brand-solid': theme('colors.green.500'),
      '--color-brand-solid-hover': theme('colors.green.600'),
      '--color-link': theme('colors.cyan.500'),
      '--color-link-hover': theme('colors.cyan.600'),
      ...defaultLightTheme(theme),
    },

    '[data-theme="new-dark"]': {
      '--color-brand': theme('colors.green.800'),
      '--color-brand-border': theme('colors.green.700.v1'),
      '--color-brand-solid': theme('colors.green.400.v1'),
      '--color-brand-solid-hover': theme('colors.green.300'),
      '--color-critical': theme('colors.red.900.v1'),
      '--color-critical-hover': theme('colors.red.800.v1'),
      '--color-critical-border': theme('colors.red.700.v1'),
      '--color-critical-solid': theme('colors.red.400.v1'),
      '--color-link': theme('colors.cyan.500'),
      '--color-link-hover': theme('colors.cyan.600'),
      '--color-primary': theme('colors.black'),
      '--color-primary-inverse': theme('colors.white'),
      '--color-secondary': theme('colors.grey.900.v1'),
      '--color-secondary-border': theme('colors.grey.800.v1'),
      '--color-secondary-text': theme('colors.grey.300.v1'),
      '--color-tertiary': theme('colors.grey.800.v1'),
      '--color-disabled': theme('colors.grey.500.v1'),
    },

    '[data-theme="startrust"]': {
      '--color-text': theme('colors.malibu.700'),
      '--color-background-solid': theme('colors.malibu.500'),
      '--color-brand': theme('colors.malibu.500'),
      '--color-brand-solid': theme('colors.malibu.500'),
      '--color-brand-solid-hover': theme('colors.malibu.700'),
      '--color-link': theme('colors.malibu.700'),
      '--color-link-hover': theme('colors.malibu.800'),
      ...defaultLightTheme(theme),
    },
  })
}
