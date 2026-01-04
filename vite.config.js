import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Library mode for Shopify embed
    lib: {
      entry: 'src/main.jsx',
      name: 'KetubanGenerator',
      fileName: 'ketubah-widget',
      formats: ['iife']
    },
    rollupOptions: {
      // Don't externalize React - bundle it
      external: [],
      output: {
        // Global variable for external access
        globals: {}
      }
    }
  }
})
