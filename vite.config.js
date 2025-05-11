import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true, // Automatically open browser on start
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Enable sourcemaps in development
      chunkSizeWarningLimit: 2048,
      // Improve chunk size
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            i18n: ['i18next', 'react-i18next'],
            mapbox: ['mapbox-gl'],
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        chunkSizeWarningLimit: 2048,
        target: 'esnext',
        // Optimize memory usage during build
        minify: false,
        splitting: true,
        format: 'esm',
        platform: 'browser'
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@locales': path.resolve(__dirname, './src/locales'),
      },
    },
    // Define environment variables to be used in the app
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});