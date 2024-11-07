import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        provider: 'istanbul',
        enabled: true,
        all: true,
        clean: true,
        reportOnFailure: true,
        reporter: ['text', 'lcov', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'node_modules/',
          '**/*.test.tsx',
          'src/setupTests.ts',
          'assets/',
          'build/',
          'src/test/mockData.tsx',
        ],
      },
      css: {
        include: /.*/,
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        }
      }
    },
    plugins: [react(), tsconfigPaths()],
  })
}
