import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  // Keep this! It is required for GitHub Pages deployment.
  base: '/Up-and-down-The-Christmas-Gifts/', 
  
  plugins: [
    react(),
    // The polyfill must be INSIDE the plugins array
    nodePolyfills({
      include: ['util'], 
    }),
  ],
  build: {
    // Since you aren't shrinking the 51MB image, this prevents build warnings
    chunkSizeWarningLimit: 2000, 
  }
})