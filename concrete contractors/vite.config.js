import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite + React config. Vercel auto-detects this (framework: Vite).
export default defineConfig({
  plugins: [react()],
})
