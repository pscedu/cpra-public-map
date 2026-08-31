import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    port: 8080,
  },
  build: {
    // Keep generated bundle output out of /assets, which is reserved for the
    // static files in public/assets referenced by hardcoded absolute paths.
    assetsDir: "build",
  },
});
