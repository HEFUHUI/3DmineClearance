import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000
  },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
})