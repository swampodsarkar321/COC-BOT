import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Root Vite config so Vercel detects the "Vite" preset.
// The actual app lives in ./web (index.html, src).
export default defineConfig({
  root: 'web',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
