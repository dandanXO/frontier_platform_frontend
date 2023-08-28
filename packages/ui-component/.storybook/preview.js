import '@frontier/tailwindcss/index.css'
import { setup } from '@storybook/vue3'
import i18n from '@frontier/i18n'

setup((app) => {
  app.use(i18n)
  const components = import.meta.glob('../src/**/*.vue', { eager: true })
  for (const path in components) {
    const component = components[path].default
    app.component(component.name, component)
  }
})

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
    },
  },
}

export default preview
