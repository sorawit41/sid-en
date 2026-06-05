import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base path to match the GitHub repository name for GitHub Pages deployment.
  // Change '/sid-en/' if your repository name on GitHub is different.
  base: process.env.NODE_ENV === 'production' ? '/sid-en/' : '/',
})

