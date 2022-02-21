import path from 'path'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import svgSpritePlugin from "vite-plugin-svg-sprite-component"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "./src/assets/scss/abstracts/_functions.scss";'
      }
    }
  },
  plugins: [
    vue(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      compositionOnly: false,
      runtimeOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './src/locales')
    }),
    svgSpritePlugin({ symbolId: (name) => name })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
