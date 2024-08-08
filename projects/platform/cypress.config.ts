import { defineConfig } from 'cypress'
const env = require('dotenv').config({ path: '.env.testing.local' }).parsed

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    chromeFlags: [
      '--max-old-space-size=4096', // ram 4096MB
    ],
  },
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
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 1,
})
