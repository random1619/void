import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@3d': path.resolve(__dirname, './src/3d'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor';
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'three-vendor';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'gsap-vendor';
          if (id.includes('node_modules/framer-motion')) return 'framer-vendor';
          if (id.includes('node_modules/@tanstack/react-query')) return 'query-vendor';
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) return 'ui-vendor';
          if (id.includes('node_modules/@stripe')) return 'stripe-vendor';
        },
      },
    },
    target: 'esnext',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@react-three/postprocessing'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
