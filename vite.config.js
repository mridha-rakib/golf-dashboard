import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,           // listen on all interfaces
    port: 5173,
    strictPort: true,
    allowedHosts: ["poems-uniform-agent-beaver.trycloudflare.com"],
  }
})
