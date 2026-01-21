import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      xlsx: "xlsx/xlsx.mjs",
    },
  },
  build: {
    outDir: "build",
  },
  optimizeDeps: {
    include: ["xlsx"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.12.6:8002",
        changeOrigin: true,
        secure: false,
      },
      "/o": {
        target: "http://192.168.12.6:8002",
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
    // port: 3000,
  },
});
