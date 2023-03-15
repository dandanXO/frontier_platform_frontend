export default {
  install(app) {
    const components = import.meta.globEager('./src/components/ModelEditor.vue')
    for (const path in components) {
      const component = components[path].default
      app.component(component.__name, component)
    }
  },
}
