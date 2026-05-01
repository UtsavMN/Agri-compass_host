/**
 * Optimized Vite Configuration
 * Performance improvements for production builds
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    
    // Gzip compression for assets
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // Only compress files larger than 1KB
    }),
    
    // Brotli compression (better than gzip)
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-charts': ['recharts'],
          'vendor-utils': ['date-fns', 'clsx', 'zustand'],
          
          // Feature chunks
          'feature-ai': ['openai', 'fuse.js'],
          'feature-supabase': ['@supabase/supabase-js'],
        },
      },
    },

    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    cssCodeSplit: true, // Split CSS into separate files
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // Warn if chunk > 1MB
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'recharts',
      '@supabase/supabase-js',
    ],
  },

  // Server configuration
  server: {
    port: 5173,
    open: true,
    cors: true,
  },

  // Preview configuration
  preview: {
    port: 4173,
    open: true,
  },
});
