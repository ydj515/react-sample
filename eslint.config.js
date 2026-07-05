import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      ".superpowers",
      "public/mockServiceWorker.js",
      "src/routeTree.gen.ts",
      "*.tsbuildinfo",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowExportNames: ["Route"] },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    ...testingLibrary.configs["flat/react"],
  },
  {
    files: ["src/shared/lib/test/**/*.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Storybook 설정/데코레이터는 컴포넌트가 아닌 export가 필요하다.
    files: [
      ".storybook/**/*.{ts,tsx}",
      "src/shared/lib/storybook/**/*.{ts,tsx}",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["src/shared/ui/dialog.tsx"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowExportNames: [
            "Dialog",
            "DialogClose",
            "DialogDescription",
            "DialogTitle",
            "DialogTrigger",
          ],
        },
      ],
    },
  },
);
