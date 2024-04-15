import path from 'path'
import { fileURLToPath, URL } from 'url'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
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
export default ({ mode }) => ({
  server: {
    port: 8080,
  },
  plugins: [
    vue(),
    htmlPlugin(loadEnv(mode, '.')),
    svgSpritePlugin({ symbolId: (name) => name }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'develop',
    // https://vitejs.dev/guide/build.html#multi-page-app
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sharePage: resolve(__dirname, 'share-page/index.html'),
      },
    },
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
})
