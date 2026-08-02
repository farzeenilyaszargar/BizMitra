import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve(__dirname),
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
