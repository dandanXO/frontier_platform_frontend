import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },

  e2e: {
    setupNodeEvents(on) {
      // implement node event listeners here
      on('task', {
        info(value) {
          console.log(value)
          return null
        },
      })
    },
    baseUrl: 'http://localhost:8080/',
    defaultCommandTimeout: 10 * 1000,
  },
})
