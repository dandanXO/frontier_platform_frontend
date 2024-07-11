import { defineConfig } from 'cypress'
const env = require('dotenv').config({ path: '.env.testing.local' }).parsed

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
    env,
    defaultCommandTimeout: 10 * 1000,
  },
})
