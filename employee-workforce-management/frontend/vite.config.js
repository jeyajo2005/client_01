import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (res && !res.headersSent) {
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'X-Backend-Status': 'offline'
              });
              res.end(JSON.stringify({
                success: false,
                isOffline: true,
                message: 'Backend server is offline on http://localhost:8080 (running in mock mode)',
                data: null
              }));
            }
          });
        }
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (res && !res.headersSent) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('File unavailable or backend server offline.');
            }
          });
        }
      }
    }
  }
})
