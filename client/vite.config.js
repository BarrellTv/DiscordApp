import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Read certificates
const key = fs.readFileSync(path.resolve(__dirname, '../certs/origin-key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, '../certs/origin-cert.pem'));

export default defineConfig({
  server: {
    https: {
      key: key,
      cert: cert,
    },
    host: 'www.hexteriamc.net', // Set the host to your custom domain
    port: 443, // Use port 443 for HTTPS
    proxy: {
      '/api': {
        target: 'http://localhost:2567', // Proxy API requests to your backend server
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      host: 'www.hexteriamc.net', // Set the HMR host to your custom domain
      port: 443, // Set the HMR port to 443
    },
  },
});
