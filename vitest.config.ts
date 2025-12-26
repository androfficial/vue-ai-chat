import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    clearMocks: true,
    coverage: {
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.{test,spec}.ts',
        'src/main.ts',
        'src/plugins/**',
        'src/types/**',
        'src/vite-env.d.ts',
      ],
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    restoreMocks: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
