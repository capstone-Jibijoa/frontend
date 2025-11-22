import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  build: {
    outDir: path.resolve(__dirname, 'build'),
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
})
