import { readFile } from "node:fs/promises";
import process from "node:process";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();
const eslint = new ESLint({ cwd: repositoryRoot });

describe("tooling configuration", () => {
  it.each([
    "dist/index.js",
    "coverage/index.html",
    "storybook-static/assets/story.js",
    "playwright-report/index.html",
    "test-results/results.json",
  ])("ignores generated output %s in ESLint", async (relativePath) => {
    expect(
      await eslint.isPathIgnored(`${repositoryRoot}/${relativePath}`),
    ).toBe(true);
  });

  it("keeps generated output in the Prettier ignore list", async () => {
    const content = await readFile(`${repositoryRoot}/.prettierignore`, "utf8");

    expect(content.split(/\r?\n/u)).toEqual(
      expect.arrayContaining([
        "dist/",
        "coverage/",
        "storybook-static/",
        "playwright-report/",
        "test-results/",
      ]),
    );
  });

  it("keeps the MSW worker regeneration directory configured", async () => {
    const content = await readFile(`${repositoryRoot}/package.json`, "utf8");
    const packageJson = JSON.parse(content) as {
      msw?: { workerDirectory?: string[] };
    };

    expect(packageJson.msw?.workerDirectory).toEqual(["public"]);
  });

  it.each([
    ["aliased static import", 'import "@/features/projects/api/project-api";'],
    [
      "relative static import",
      'import "../../features/projects/api/project-api";',
    ],
    [
      "aliased dynamic import",
      'void import("@/features/projects/api/project-api");',
    ],
    [
      "relative dynamic import",
      'void import("../../features/projects/api/project-api");',
    ],
    ["aliased require", 'require("@/features/projects/api/project-api");'],
    ["relative require", 'require("../../features/projects/api/project-api");'],
  ])("rejects %s from shared code", async (_case, source) => {
    const [result] = await eslint.lintText(`${source}\n`, {
      filePath: `${repositoryRoot}/src/shared/lib/invalid-boundary.ts`,
    });

    expect(result?.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "architecture/layer-boundaries" }),
      ]),
    );
  });

  it.each([
    ["aliased static import", 'import "@/stores/auth-store";'],
    ["relative static import", 'import "../../../stores/auth-store";'],
    ["aliased dynamic import", 'void import("@/stores/auth-store");'],
    ["relative dynamic import", 'void import("../../../stores/auth-store");'],
    ["aliased require", 'require("@/stores/auth-store");'],
    ["relative require", 'require("../../../stores/auth-store");'],
  ])("rejects %s from feature API code", async (_case, source) => {
    const [result] = await eslint.lintText(`${source}\n`, {
      filePath: `${repositoryRoot}/src/features/auth/api/invalid-boundary.ts`,
    });

    expect(result?.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "architecture/layer-boundaries" }),
      ]),
    );
  });

  it("allows relative imports that stay inside the shared layer", async () => {
    const [result] = await eslint.lintText(
      'import "../api/api-error";\nvoid import("./local-module");\n',
      { filePath: `${repositoryRoot}/src/shared/lib/valid-boundary.ts` },
    );

    expect(
      result?.messages.filter(
        (message) => message.ruleId === "architecture/layer-boundaries",
      ),
    ).toEqual([]);
  });
});

describe("import block spacing", () => {
  it.each(["\n", "\n\n\n", " "])("fixes separator %j", async (separator) => {
    const fixer = new ESLint({ cwd: repositoryRoot, fix: true });
    const [result] = await fixer.lintText(
      `import "./local";${separator}export const value = 1;\n`,
      { filePath: `${repositoryRoot}/src/example.ts` },
    );
    expect(result?.output).toBe(
      'import "./local";\n\nexport const value = 1;\n',
    );
  });
  it("preserves import groups and trailing comments", async () => {
    const fixer = new ESLint({ cwd: repositoryRoot, fix: true });
    const [result] = await fixer.lintText(
      'import "./a";\nimport "./b"; // reason\n// declaration\nexport const value = 1;\n',
      { filePath: `${repositoryRoot}/src/example.ts` },
    );
    expect(result?.output).toBe(
      'import "./a";\nimport "./b"; // reason\n\n// declaration\nexport const value = 1;\n',
    );
  });
});

describe("colocated import paths", () => {
  it.each([
    ['import "../api/client";', 'import "@/features/example/api/client";'],
    [
      'export * from "./child/module";',
      'export * from "@/features/example/model/child/module";',
    ],
    [
      'void import("@/features/example/model/local");',
      'void import("./local");',
    ],
    [
      'import type { Value } from "./local";',
      'import type { Value } from "./local";',
    ],
    ['import "react";', 'import "react";'],
  ])("normalizes %s", async (input, expected) => {
    const fixer = new ESLint({ cwd: repositoryRoot, fix: true });
    const [result] = await fixer.lintText(input + "\n", {
      filePath: `${repositoryRoot}/src/features/example/model/example.ts`,
    });
    expect(result?.output ?? input + "\n").toBe(expected + "\n");
  });
});

describe("feature public APIs", () => {
  it.each([
    'import { orderSchema } from "@/features/orders/model/order-schema";',
    'export { orderSchema } from "@/features/orders/model/order-schema";',
    'void import("@/features/orders/model/order-schema");',
    'require("@/features/orders/model/order-schema");',
    'export type Other = import("@/features/orders/model/order-schema").Order;',
    'import Other = require("@/features/orders/model/order-schema");',
  ])("rejects cross-feature implementation access: %s", async (source) => {
    const [result] = await eslint.lintText(source + "\n", {
      filePath: `${repositoryRoot}/src/features/dashboard/model/public-api-check.ts`,
    });
    expect(result.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "architecture/feature-public-api" }),
      ]),
    );
  });
  it.each([
    [
      "src/features/dashboard/model/check.ts",
      'import { orderSchema } from "@/features/orders/model";',
    ],
    [
      "src/routes/check.tsx",
      'import { OrdersPage } from "@/features/orders/pages/orders";',
    ],
    [
      "src/features/orders/components/check.tsx",
      'import { orderSchema } from "@/features/orders/model/order-schema";',
    ],
  ])(
    "allows public consumption or internal implementation imports from %s",
    async (filePath, source) => {
      const [result] = await eslint.lintText(source + "\n", {
        filePath: `${repositoryRoot}/${filePath}`,
      });
      expect(
        result.messages.filter(
          (message) => message.ruleId === "architecture/feature-public-api",
        ),
      ).toEqual([]);
    },
  );
  it.each([
    [
      "src/features/dashboard/model/check.ts",
      'import { OrdersPage } from "@/features/orders/pages/orders";',
    ],
    [
      "src/features/orders/components/check.tsx",
      'import { orderSchema } from "@/features/orders/model";',
    ],
    ["src/features/orders/model/index.ts", 'export * from "./order-schema";'],
  ])(
    "rejects UI access from data, self-barrels and implicit exports from %s",
    async (filePath, source) => {
      const [result] = await eslint.lintText(source + "\n", {
        filePath: `${repositoryRoot}/${filePath}`,
      });
      expect(result.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: "architecture/feature-public-api",
          }),
        ]),
      );
    },
  );
});

describe("feature stores", () => {
  it.each([
    [
      "src/layouts/check.tsx",
      'import { useShopStore } from "@/features/shop/store";',
    ],
    [
      "src/features/shop/pages/check.tsx",
      'import { useShopStore } from "@/features/shop/store/shop-store";',
    ],
  ])("allows store consumption from %s", async (filePath, source) => {
    const [result] = await eslint.lintText(source + "\n", {
      filePath: `${repositoryRoot}/${filePath}`,
    });
    expect(
      result.messages.filter(
        (message) => message.ruleId === "architecture/feature-public-api",
      ),
    ).toEqual([]);
  });

  it.each(["api", "model", "queries"])(
    "rejects store imports from %s in the same or another feature",
    async (layer) => {
      for (const feature of ["shop", "orders"]) {
        for (const target of [
          "@/features/shop/store",
          "@/features/shop/store/shop-store",
        ]) {
          const [result] = await eslint.lintText(
            `import { useShopStore } from "${target}";\n`,
            {
              filePath: `${repositoryRoot}/src/features/${feature}/${layer}/check.ts`,
            },
          );
          expect(result.messages).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                ruleId: "architecture/feature-public-api",
                messageId: "data",
              }),
            ]),
          );
        }
      }
    },
  );

  it.each([
    [
      "src/layouts/check.tsx",
      'import { useShopStore } from "@/features/shop/store/shop-store";',
      "private",
    ],
    [
      "src/features/shop/pages/check.tsx",
      'import { useShopStore } from "@/features/shop/store";',
      "self",
    ],
    [
      "src/features/shop/store/index.ts",
      'export * from "./shop-store";',
      "wildcard",
    ],
  ])(
    "rejects invalid store boundaries from %s",
    async (filePath, source, messageId) => {
      const [result] = await eslint.lintText(source + "\n", {
        filePath: `${repositoryRoot}/${filePath}`,
      });
      expect(result.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: "architecture/feature-public-api",
            messageId,
          }),
        ]),
      );
    },
  );
});
