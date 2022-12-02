import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'https': path.resolve(__dirname, 'node_modules/stream-http')
    }
}
})
