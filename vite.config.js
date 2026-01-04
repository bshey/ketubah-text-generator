import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library mode for Shopify embed (npm run build:widget)
  if (mode === 'widget') {
    return {
      plugins: [react()],
      define: {
        // Replace process.env references for browser compatibility
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': JSON.stringify({})
      },
      build: {
        lib: {
          entry: 'src/main.jsx',
          name: 'KetubanGenerator',
          fileName: 'ketubah-widget',
          formats: ['iife']
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {}
          }
        }
      }
    }
  }

  // Default: Standard web app build for Vercel deployment
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: 'index.html'
      }
    }
  }
})
