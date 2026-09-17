import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/** Must match the fallback in webpack.config.ts */
const FALLBACK_API_URL = 'http://localhost:8001/api/v1';

export default defineConfig(({ mode }) => {
  // Vite loads `.env*` files itself; mirror webpack by injecting the same value
  const env = loadEnv(mode, __dirname, '');

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      API_BASE_URL: JSON.stringify(env.VITE_API_URL || FALLBACK_API_URL),
    },
  };
});
