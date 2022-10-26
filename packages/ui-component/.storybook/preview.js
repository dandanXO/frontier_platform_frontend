import '@frontier/tailwindcss/index.css'
import { app } from '@storybook/vue3'

const components = import.meta.globEager('../src/**/*.vue')
for (const path in components) {
  const component = components[path].default
  app.component(component.name, component)
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
  },
}
