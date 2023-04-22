/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'url'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  })
)
