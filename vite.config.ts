import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        support: resolve(__dirname, 'support.html'),
        thankyou: resolve(__dirname, 'thank-you.html'),
        department: resolve(__dirname, 'department/index.html'),
      },
    },
  },
})
