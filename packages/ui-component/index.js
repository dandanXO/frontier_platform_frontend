export default {
  install (app) {
    const components = import.meta.globEager('./src/**/*.vue')
    for (const path in components) {
      const component = components[path].default
      app.component(component.name, component)
    }
  }
}
