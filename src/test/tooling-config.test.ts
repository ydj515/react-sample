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
