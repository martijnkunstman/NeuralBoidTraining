import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  base: './',
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['@dimforge/rapier2d-compat']
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});



