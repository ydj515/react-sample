import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(repositoryRoot, "src");

function resolveSourceImport(filename, specifier) {
  if (specifier.startsWith("@/")) {
    return path.resolve(sourceRoot, specifier.slice(2));
  }

  if (specifier.startsWith(".")) {
    return path.resolve(path.dirname(filename), specifier);
  }

  return undefined;
}

const architecturePlugin = {
  rules: {
    "import-block-spacing": {
      meta: {
        type: "layout",
        fixable: "whitespace",
        schema: [],
        messages: {
          spacing: "Use exactly one blank line after an import block.",
        },
      },
      create(context) {
        const source = context.sourceCode;
        return {
          Program(program) {
            program.body.forEach((node, index) => {
              if (
                node.type !== "ImportDeclaration" ||
                program.body[index + 1]?.type === "ImportDeclaration"
              )
                return;
              let anchor = node;
              let next = source.getTokenAfter(anchor, {
                includeComments: true,
              });
              while (
                next &&
                next.loc.start.line === anchor.loc.end.line &&
                ["Line", "Block"].includes(next.type)
              ) {
                anchor = next;
                next = source.getTokenAfter(anchor, { includeComments: true });
              }
              if (!next || next.loc.start.line - anchor.loc.end.line === 2)
                return;
              context.report({
                node,
                messageId: "spacing",
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [anchor.range[1], next.range[0]],
                    "\n\n" +
                      " ".repeat(
                        next.loc.start.line === anchor.loc.end.line
                          ? 0
                          : next.loc.start.column,
                      ),
                  );
                },
              });
            });
          },
        };
      },
    },
    "colocated-imports": {
      meta: {
        type: "suggestion",
        fixable: "code",
        schema: [],
        messages: {
          path: "Use {{expected}}: only colocated modules use ./; other source modules use @/.",
        },
      },
      create(context) {
        function check(source) {
          if (typeof source?.value !== "string") return;
          const target = resolveSourceImport(context.filename, source.value);
          if (!target) return;
          const relative = path.relative(sourceRoot, target);
          if (relative.startsWith("..") || path.isAbsolute(relative)) return;
          const expected =
            path.dirname(target) === path.dirname(context.filename)
              ? `./${path.basename(target)}`
              : `@/${relative.split(path.sep).join("/")}`;
          if (source.value === expected) return;
          context.report({
            node: source,
            messageId: "path",
            data: { expected },
            fix: (fixer) => fixer.replaceText(source, JSON.stringify(expected)),
          });
        }
        return {
          ImportDeclaration: (node) => check(node.source),
          ExportNamedDeclaration: (node) => check(node.source),
          ExportAllDeclaration: (node) => check(node.source),
          ImportExpression: (node) => check(node.source),
          TSImportType: (node) => check(node.source),
          TSImportEqualsDeclaration: (node) =>
            check(node.moduleReference.expression),
          CallExpression(node) {
            if (
              node.callee.type === "Identifier" &&
              node.callee.name === "require"
            )
              check(node.arguments[0]);
          },
        };
      },
    },
    "feature-public-api": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          private:
            "Consume another feature through its explicit layer public API (@/features/<feature>/<layer>).",
          self: "Feature internals must import implementation modules directly, not their own public API.",
          data: "Feature data layers cannot consume feature UI or store APIs or implementations.",
          wildcard:
            "Declare named exports in feature public APIs; do not export *.",
        },
      },
      create(context) {
        const source = path
          .relative(sourceRoot, context.filename)
          .split(path.sep);
        const publicLayers = new Set([
          "api",
          "model",
          "queries",
          "store",
          "hooks",
          "components",
          "pages",
        ]);
        const dataLayers = new Set(["api", "model", "queries"]);
        const restrictedDataTargets = new Set([
          "hooks",
          "components",
          "pages",
          "store",
        ]);
        const publicFile =
          source[0] === "features" &&
          source.length >= 4 &&
          publicLayers.has(source[2]) &&
          /^index\.[cm]?[jt]sx?$/.test(source.at(-1));
        function check(node) {
          if (typeof node?.value !== "string") return;
          const resolved = resolveSourceImport(context.filename, node.value);
          if (!resolved) return;
          const target = path.relative(sourceRoot, resolved).split(path.sep);
          if (target[0] !== "features") return;
          const sameFeature =
            source[0] === "features" && source[1] === target[1];
          const explicitIndex = /^index(?:\.[cm]?[jt]sx?)?$/.test(
            target.at(-1),
          );
          const entryDirectory = explicitIndex
            ? path.dirname(resolved)
            : resolved;
          const publicEntry =
            publicLayers.has(target[2]) &&
            (target[2] === "pages"
              ? target.length >= 4 &&
                existsSync(path.join(entryDirectory, "index.ts"))
              : target.length === 3 || (target.length === 4 && explicitIndex));
          let messageId;
          if (
            source[0] === "features" &&
            dataLayers.has(source[2]) &&
            restrictedDataTargets.has(target[2])
          )
            messageId = "data";
          else if (sameFeature && publicEntry) messageId = "self";
          else if (!sameFeature && !publicEntry) messageId = "private";
          if (messageId) context.report({ node, messageId });
        }
        return {
          ImportDeclaration: (node) => check(node.source),
          ExportNamedDeclaration: (node) => check(node.source),
          ExportAllDeclaration(node) {
            if (publicFile) context.report({ node, messageId: "wildcard" });
            check(node.source);
          },
          ImportExpression: (node) => check(node.source),
          TSImportType: (node) => check(node.source),
          TSImportEqualsDeclaration: (node) =>
            check(node.moduleReference.expression),
          CallExpression(node) {
            if (
              node.callee.type === "Identifier" &&
              node.callee.name === "require"
            )
              check(node.arguments[0]);
          },
        };
      },
    },
    "layer-boundaries": {
      meta: {
        type: "problem",
        schema: [
          {
            type: "object",
            properties: {
              restrictedLayers: {
                type: "array",
                items: { type: "string" },
                uniqueItems: true,
              },
              message: { type: "string" },
            },
            required: ["restrictedLayers", "message"],
            additionalProperties: false,
          },
        ],
        messages: {
          restrictedLayer: "{{message}}",
        },
      },
      create(context) {
        const [{ restrictedLayers, message }] = context.options;
        const restrictedLayerSet = new Set(restrictedLayers);

        function checkSource(sourceNode) {
          const specifier = sourceNode?.value;

          if (typeof specifier !== "string") {
            return;
          }

          const targetPath = resolveSourceImport(context.filename, specifier);

          if (!targetPath) {
            return;
          }

          const relativeTarget = path.relative(sourceRoot, targetPath);

          if (
            path.isAbsolute(relativeTarget) ||
            relativeTarget === ".." ||
            relativeTarget.startsWith(`..${path.sep}`)
          ) {
            return;
          }

          const [targetLayer] = relativeTarget.split(path.sep);

          if (targetLayer && restrictedLayerSet.has(targetLayer)) {
            context.report({
              node: sourceNode,
              messageId: "restrictedLayer",
              data: { message },
            });
          }
        }

        return {
          ImportDeclaration(node) {
            checkSource(node.source);
          },
          ExportNamedDeclaration(node) {
            checkSource(node.source);
          },
          ExportAllDeclaration(node) {
            checkSource(node.source);
          },
          ImportExpression(node) {
            checkSource(node.source);
          },
          CallExpression(node) {
            if (
              node.callee.type === "Identifier" &&
              node.callee.name === "require"
            ) {
              checkSource(node.arguments[0]);
            }
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "storybook-static",
      "playwright-report",
      "test-results",
      ".superpowers",
      "public/mockServiceWorker.js",
      "src/routeTree.gen.ts",
      "*.tsbuildinfo",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: { "architecture/import-block-spacing": "error" },
    plugins: {
      architecture: architecturePlugin,
    },
  },
  {
    files: ["src/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
    rules: {
      "architecture/colocated-imports": "error",
      "architecture/feature-public-api": "error",
    },
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
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "architecture/layer-boundaries": [
        "error",
        {
          restrictedLayers: ["features", "routes", "pages", "layouts", "app"],
          message:
            "Shared modules cannot depend on application or feature layers.",
        },
      ],
    },
  },
  {
    files: ["src/features/*/{api,model,queries}/**/*.{ts,tsx}"],
    rules: {
      "architecture/layer-boundaries": [
        "error",
        {
          restrictedLayers: ["app", "routes", "pages", "layouts", "stores"],
          message:
            "Feature data layers cannot depend on UI or global store layers.",
        },
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
