import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // envDir: './environments',
  // envPrefix: '__',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // 导入时想要省略的扩展名列表。
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/blob': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/blob/, '')
      },
      '/wyy': {
        target: 'https://api.vvhan.com/api',
        // https://api.vvhan.com/api/avatar
        // https://api.vvhan.com/api/music
        changeOrigin: true,
        rewrite: path => path.replace(/^\/wyy/, '')
      }
    }
  }
});
