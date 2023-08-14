import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import svgSpritePlugin from 'vite-plugin-svg-sprite-component'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    vue(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      compositionOnly: false,
      runtimeOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './src/locales'),
    }),
    svgSpritePlugin({ symbolId: (name) => name }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
})
