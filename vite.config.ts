import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      input: {
        popup: resolve(process.cwd(), 'index.html'),
        content: resolve(process.cwd(), 'src/content/content.ts'),
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content') {
            return 'content.js'
          }

          return 'assets/[name]-[hash].js'
        },
      },
    },
  },
})