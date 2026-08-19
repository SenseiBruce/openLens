import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/App.tsx',
        'src/components/TopBar.tsx',
        'src/components/ProjectList.tsx',
        'src/components/ErrorBanner.tsx',
        'src/lib/**/*.{ts,tsx}',
      ],
      exclude: ['src/**/*.test.*', 'src/test/**', 'src/components/__tests__/**'],
      thresholds: {
        lines: 60,
      },
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
