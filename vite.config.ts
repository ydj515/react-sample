import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const isTest = process.env.NODE_ENV === "test";

export default defineConfig({
  plugins: [!isTest && TanStackRouterVite(), react(), tsconfigPaths()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
