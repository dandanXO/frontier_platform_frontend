import type { App } from 'vue'

export default {
  install(app: App) {
    const components = import.meta.glob('./src/components/ModelEditor.vue', {
      eager: true,
    })
    for (const path in components) {
      const component = components[path].default
      app.component(component.__name, component)
    }
  },
}
