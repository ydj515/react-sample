import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "src/routeTree.gen.ts",
        "src/test/**",
        "src/**/*.d.ts",
        "src/**/*.stories.tsx",
        "src/main.tsx",
        ".storybook/**",
      ],
      // 실측치(Stmts 88 / Branch 83 / Funcs 85 / Lines 87)보다 여유를 두어
      // CI가 상시 실패하지 않으면서 회귀는 잡도록 한다.
      thresholds: {
        statements: 80,
        branches: 78,
        functions: 78,
        lines: 80,
      },
    },
  },
});
