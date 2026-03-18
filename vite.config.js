import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLib = mode === 'lib'
  const isDemo = mode === 'demo'

  const config = {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }

  if (isLib) {
    config.build = {
      lib: {
        entry: resolve(__dirname, 'src/lib/index.js'),
        name: 'VueSettingsPanel',
        fileName: (format) => `vue-settings-panel.${format}.js`,
      },
      rollupOptions: {
        external: ['vue', 'material-icons'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    }
  } else {
    config.build = {
      outDir: isDemo ? 'dist-demo' : 'dist',
    }
  }

  return config
})
