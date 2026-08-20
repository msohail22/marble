import { defineConfig } from "npm:vite@^5.0.0";
import react from "npm:@vitejs/plugin-react@^4.0.0";
import tailwindcss from "npm:tailwindcss@^3.0.0";
import autoprefixer from "npm:autoprefixer@^10.0.0";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
