import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '',
  plugins: [
    react({
      include: /.(jsx|tsx)$/,
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
        babelrc: false,
        configFile: false
      }
    }),
    viteTsconfigPaths()
  ],
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'build',
    target: 'es2022'
  }
})
