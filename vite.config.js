import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prefixer from 'postcss-prefix-selector'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library mode for Shopify embed (npm run build:widget)
  if (mode === 'widget') {
    return {
      plugins: [react()],
      css: {
        postcss: {
          plugins: [
            prefixer({
              prefix: '.ketubah-generator',
              transform(prefix, selector, prefixedSelector, filePath, rule) {
                // Determine if we should prefix this selector

                // 1. Don't prefix the container class itself (it's already the prefix)
                if (selector === '.ketubah-generator') {
                  return selector;
                }

                // 2. Don't prefix :root or body or html (though we shouldn't have them)
                if (selector === ':root' || selector === 'body' || selector === 'html') {
                  return selector;
                }

                // 3. Don't double prefix if it's already prefixed (from our manual edits)
                if (selector.startsWith('.ketubah-generator ')) {
                  return selector;
                }

                // Prefix everything else
                return prefixedSelector;
              }
            })
          ]
        }
      },
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
