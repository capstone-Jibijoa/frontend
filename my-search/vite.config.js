import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'build'),
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
})
