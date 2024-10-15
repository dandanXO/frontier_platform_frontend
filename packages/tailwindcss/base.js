export default function ({ addBase, theme }) {
  addBase({
    ':root': {
      '--color-brand-solid': theme('colors.primary.400'),
      '--color-brand-solid-hover': theme('colors.primary.500'),
      '--color-link': theme('colors.primary.400'),
      '--color-link-hover': theme('colors.primary.500'),
    },

    '[data-theme="new"]': {
      '--color-brand-solid': theme('colors.newgreen.500'),
      '--color-brand-solid-hover': theme('colors.newgreen.600'),
      '--color-link': theme('colors.cyan.500'),
      '--color-link-hover': theme('colors.cyan.600'),
    },

    '[data-theme="startrust"]': {
      '--color-brand-solid': theme('colors.malibu.500'),
      '--color-brand-solid-hover': theme('colors.malibu.700'),
      '--color-link': theme('colors.malibu.700'),
      '--color-link-hover': theme('colors.malibu.800'),
    },
  })
}
