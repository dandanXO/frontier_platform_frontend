import path from 'path'
import { fileURLToPath, URL } from 'url'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgSpritePlugin from 'vite-plugin-svg-sprite-component'
import { execSync } from 'child_process'
import packageJson from '../../package.json'
const { resolve } = path

const getGitTag = () => {
  try {
    // Try to get the latest tag
    const latestTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    }).trim()
    return latestTag || 'v' + packageJson.version
  } catch (error) {
    console.warn('Failed to get Git tag:', error)
    // Fallback to package.json version if git command fails
    return 'v' + packageJson.version
  }
}

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
// 詳細說明issue f22/3328 https://frontier-cool.atlassian.net/issues/F22-3328
// 處理模板語言取代的問題
const htmlPluginFormatTemplate = (data) => ({
  name: 'transform-html',
  transformIndexHtml: {
    enforce: 'pre',
    transform(html) {
      return html.replace(/<%=\s*(\w+)\s*%>/gi, (match, p1) => data[p1] || '')
    },
  },
})
const buildTime = new Date()
// https://vitejs.dev/config/
export default ({ mode }) => ({
  server: {
    port: 8080,
  },
  plugins: [
    vue(),
    htmlPlugin(loadEnv(mode, '.')),
    htmlPluginFormatTemplate({ time: buildTime.toString() }),
    svgSpritePlugin({ symbolId: (name) => name }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getGitTag()),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
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
