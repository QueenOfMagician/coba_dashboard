import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['@duckdb/duckdb-wasm'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) {
              if (id.includes('echarts/core') || id.includes('echarts/lib/core')) {
                return 'vendor-echarts-core'
              }
              if (id.includes('echarts/charts') || id.includes('echarts/lib/chart')) {
                // Split common charts from specialty charts
                if (id.includes('bar') || id.includes('line') || id.includes('pie') || id.includes('scatter')) {
                  return 'vendor-echarts-charts-main'
                }
                return 'vendor-echarts-charts-special'
              }
              return 'vendor-echarts-libs'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-framework'
            }
            if (id.includes('@duckdb/duckdb-wasm')) {
              return 'vendor-duckdb'
            }
            if (id.includes('react-querybuilder')) {
              return 'vendor-querybuilder'
            }
            if (id.includes('react-grid-layout')) {
              return 'vendor-grid-layout'
            }
            if (id.includes('@dnd-kit')) {
              return 'vendor-dnd'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
