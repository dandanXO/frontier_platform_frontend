import path from 'path'
import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import svgSpritePlugin from 'vite-plugin-svg-sprite-component'
const { resolve } = path

// https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
const htmlPlugin = (env) => {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre',
      transform: (html) =>
        html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
  },
  plugins: [
    htmlPlugin(loadEnv(mode, '.')),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('lord-'),
        },
      },
    }),
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
  build: {
    // https://vitejs.dev/guide/build.html#multi-page-app
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sharePage: resolve(__dirname, 'share-page/index.html'),
      },
    },
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
}))
