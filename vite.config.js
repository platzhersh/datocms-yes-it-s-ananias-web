import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
// import browserslistToEsbuild from 'browserslist-to-esbuild'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [
    react({
      include: /\.(jsx|tsx)$/,
      babel: {
        plugins: ["babel-plugin-styled-components"],
        babelrc: false,
        configFile: false,
      },
    }),
    viteTsconfigPaths(),
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  build: {
    // target: browserslistToEsbuild(),
    outDir: "build",
    minify: 'esbuild', // Use esbuild for minification (default, but explicit)
    sourcemap: false,   // Disable source maps for production
    cssCodeSplit: true, // Split CSS into separate files
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'vendor-react': ['react', 'react-dom', 'wouter'],
          // Apollo GraphQL ecosystem
          'vendor-apollo': [
            'apollo-client',
            'apollo-cache-inmemory',
            'apollo-link-http',
            'react-apollo',
            'graphql',
            'graphql-tag'
          ],
          // Styling libraries (runtime only)
          'vendor-ui': [
            'styled-components'
          ],
          // Other utilities
          'vendor-utils': ['lodash', 'luxon']
        }
      }
    }
  },
});
