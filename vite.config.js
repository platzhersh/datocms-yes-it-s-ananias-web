import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
// import browserslistToEsbuild from 'browserslist-to-esbuild'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [
    react({
      include: /.(jsx|tsx)$/,
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin",],
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
    uglify: true,
  },
});
