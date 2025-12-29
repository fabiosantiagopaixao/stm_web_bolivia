import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: {
    sourcemap: false, // ⬅️ DESATIVA source map
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      components: resolve(__dirname, "./src/components"),
      pages: resolve(__dirname, "./src/pages"),
      contexts: resolve(__dirname, "./src/web"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          "https://script.google.com/macros/s/AKfycbwR3WVAPyUhzXVUniBlHvKtkcOA7ORiIPZGf4YzD9sCuDKSpbhqYw_IK4nvrqnelBetVw/exec",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
