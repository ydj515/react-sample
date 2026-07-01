# React Sample Dashboard Template 구현 계획

> **agentic worker 필수:** 이 계획을 task 단위로 실행할 때는 `superpowers:subagent-driven-development`를 권장하며, inline으로 실행할 경우 `superpowers:executing-plans`를 사용한다. 각 단계는 추적 가능한 checkbox 문법을 사용한다.

**Goal:** 기존 React 샘플을 Node 24.13.0, React 19, Tailwind CSS v4, TanStack Router, TanStack Query, Zustand, MSW, React Hook Form, Zod, Vitest 기반의 실무형 프로젝트 대시보드 템플릿으로 재구성한다.

**Architecture:** feature-first 구조를 사용하고 TanStack Router route 파일은 얇게 유지한다. 서버 상태는 TanStack Query, 클라이언트 UI 상태는 Zustand, mock API는 MSW, 폼 검증은 React Hook Form과 Zod가 담당한다.

**Tech Stack:** Node 24.13.0, pnpm, React, Vite, TypeScript, Tailwind CSS v4, TanStack Router, TanStack Query, Zustand, MSW, Radix primitives, React Hook Form, Zod, Vitest, Testing Library, ESLint, Prettier.

---

## 작업 전 기준

- 현재 브랜치: `feat/react-dashboard-template`
- 설계 문서: `docs/superpowers/specs/2026-07-02-react-sample-dashboard-template-design.md`
- 브라우저 brainstorming 산출물 `.superpowers/`는 source artifact가 아니므로 `.gitignore`에 추가한다.
- 기존 `src` 구조는 유지 대상이 아니며, 충돌하는 파일은 새 구조로 대체한다.

## 파일 구조 지도

### 생성 또는 대체할 설정 파일

- Create: `mise.toml` - Node 24.13.0 고정
- Modify: `package.json` - dependency, script, engine, packageManager 정리
- Modify: `vite.config.ts` - React, TanStack Router, Tailwind v4, tsconfig paths 설정
- Create: `vitest.config.ts` - jsdom 테스트 설정
- Modify: `eslint.config.js` - flat config, TS/React/Test lint 설정
- Create: `prettier.config.js` - Prettier와 Tailwind class sort 설정
- Modify: `tsconfig.json` - project references 유지
- Modify: `tsconfig.app.json` - app TS 옵션과 alias
- Modify: `tsconfig.node.json` - config 파일 TS 옵션
- Create: `tsconfig.vitest.json` - 테스트 TS 옵션
- Modify: `tsr.config.json` - TanStack Router route 설정
- Modify: `.gitignore` - `.superpowers`, coverage, build info 추가
- Delete: `postcss.config.js`
- Delete: `tailwind.config.js`
- Delete: `src/App.css`

### 생성할 source 파일

- `src/main.tsx` - 앱 entry
- `src/app/App.tsx` - RouterProvider 연결
- `src/app/router.tsx` - router instance와 타입 등록
- `src/app/providers/AppProviders.tsx` - 전체 provider 조합
- `src/app/providers/QueryProvider.tsx` - QueryClient provider
- `src/app/styles/index.css` - Tailwind v4 import와 design token
- `src/layouts/DashboardLayout.tsx` - app shell
- `src/layouts/AuthLayout.tsx` - signin shell
- `src/routes/__root.tsx` - root route
- `src/routes/signin.tsx` - signin route
- `src/routes/_dashboard.tsx` - dashboard layout route
- `src/routes/_dashboard/index.tsx` - dashboard home route
- `src/routes/_dashboard/projects.index.tsx` - project list route
- `src/routes/_dashboard/projects.$projectId.tsx` - project detail route
- `src/routes/_dashboard/settings.tsx` - settings route
- `src/features/dashboard/pages/DashboardPage.tsx`
- `src/features/dashboard/components/MetricCard.tsx`
- `src/features/dashboard/components/RecentProjects.tsx`
- `src/features/projects/api/project-api.ts`
- `src/features/projects/components/CreateProjectDialog.tsx`
- `src/features/projects/components/ProjectCard.tsx`
- `src/features/projects/components/ProjectFilters.tsx`
- `src/features/projects/components/ProjectStatusBadge.tsx`
- `src/features/projects/hooks/use-project-filters.ts`
- `src/features/projects/model/project-schema.ts`
- `src/features/projects/model/project-types.ts`
- `src/features/projects/model/project-utils.ts`
- `src/features/projects/pages/ProjectDetailPage.tsx`
- `src/features/projects/pages/ProjectsPage.tsx`
- `src/features/projects/queries/project-queries.ts`
- `src/features/settings/pages/SettingsPage.tsx`
- `src/shared/ui/badge.tsx`
- `src/shared/ui/button.tsx`
- `src/shared/ui/card.tsx`
- `src/shared/ui/dialog.tsx`
- `src/shared/ui/input.tsx`
- `src/shared/ui/label.tsx`
- `src/shared/ui/select.tsx`
- `src/shared/ui/skeleton.tsx`
- `src/shared/lib/cn.ts`
- `src/shared/lib/format-date.ts`
- `src/shared/lib/test/render-with-providers.tsx`
- `src/shared/lib/test/test-query-client.ts`
- `src/stores/ui-store.ts`
- `src/mocks/browser.ts`
- `src/mocks/handlers.ts`
- `src/mocks/server.ts`
- `src/mocks/data/projects.ts`
- `src/test/setup.ts`

### 생성할 테스트 파일

- `src/shared/lib/cn.test.ts`
- `src/shared/lib/format-date.test.ts`
- `src/stores/ui-store.test.ts`
- `src/features/projects/__tests__/project-schema.test.ts`
- `src/features/projects/__tests__/project-utils.test.ts`
- `src/features/projects/__tests__/project-api.integration.test.ts`
- `src/features/projects/__tests__/ProjectStatusBadge.test.tsx`
- `src/features/projects/__tests__/CreateProjectDialog.test.tsx`
- `src/features/projects/__tests__/ProjectsPage.integration.test.tsx`
- `src/layouts/DashboardLayout.test.tsx`

---

## Task 1: 런타임, 패키지, 설정 파일 최신화

**Files:**
- Create: `mise.toml`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `vitest.config.ts`
- Modify: `eslint.config.js`
- Create: `prettier.config.js`
- Modify: `tsconfig.json`
- Modify: `tsconfig.app.json`
- Modify: `tsconfig.node.json`
- Create: `tsconfig.vitest.json`
- Modify: `tsr.config.json`
- Modify: `.gitignore`
- Delete: `postcss.config.js`
- Delete: `tailwind.config.js`
- Delete: `src/App.css`

- [ ] **Step 1: 현재 런타임 기준 확인**

Run:

```bash
node --version
pnpm --version
git status --short --branch
```

Expected:

```txt
v24.13.0
11.7.0
## feat/react-dashboard-template
```

- [ ] **Step 2: dependency 설치**

Run:

```bash
pnpm add react@latest react-dom@latest @tanstack/react-router@latest @tanstack/react-query@latest zustand@latest @radix-ui/react-dialog@latest @radix-ui/react-slot@latest react-hook-form@latest zod@latest @hookform/resolvers@latest msw@latest clsx@latest tailwind-merge@latest class-variance-authority@latest
pnpm add -D @vitejs/plugin-react-swc@latest vite@latest typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest tailwindcss@latest @tailwindcss/vite@latest vite-tsconfig-paths@latest @tanstack/router-cli@latest @tanstack/router-plugin@latest vitest@latest jsdom@latest @testing-library/react@latest @testing-library/user-event@latest @testing-library/jest-dom@latest @vitest/coverage-v8@latest eslint@latest @eslint/js@latest typescript-eslint@latest eslint-plugin-react-hooks@latest eslint-plugin-react-refresh@latest eslint-plugin-testing-library@latest globals@latest prettier@latest prettier-plugin-tailwindcss@latest
```

Expected:

```txt
dependencies:
+ @tanstack/react-query
+ @tanstack/react-router
+ zustand
+ msw
devDependencies:
+ vite
+ vitest
+ tailwindcss
+ @tailwindcss/vite
```

- [ ] **Step 3: `mise.toml` 작성**

Write:

```toml
[tools]
node = "24.13.0"
```

- [ ] **Step 4: `package.json` script와 metadata 정리**

Set these fields:

```json
{
  "name": "react-sample",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "24.13.0",
    "pnpm": ">=11.7.0"
  },
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "dev": "pnpm generate-routes && vite",
    "build": "pnpm generate-routes && tsc -b && vite build",
    "preview": "vite preview",
    "generate-routes": "tsr generate",
    "watch-routes": "tsr watch",
    "typecheck": "tsc -b --pretty false",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write --cache",
    "format:check": "prettier . --check --cache",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "validate": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build"
  }
}
```

- [ ] **Step 5: `vite.config.ts` 작성**

Write:

```ts
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
```

- [ ] **Step 6: `vitest.config.ts` 작성**

Write:

```ts
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/routeTree.gen.ts", "src/test/**", "src/**/*.d.ts"],
    },
  },
});
```

- [ ] **Step 7: ESLint와 Prettier 설정 작성**

Write `eslint.config.js`:

```js
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
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    ...testingLibrary.configs["flat/react"],
  },
);
```

Write `prettier.config.js`:

```js
export default {
  plugins: ["prettier-plugin-tailwindcss"],
};
```

- [ ] **Step 8: TS 설정 작성**

Write `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.vitest.json" }
  ]
}
```

Write `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Write `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": [
    "vite.config.ts",
    "vitest.config.ts",
    "eslint.config.js",
    "prettier.config.js"
  ]
}
```

Write `tsconfig.vitest.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.vitest.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**/*.ts"]
}
```

- [ ] **Step 9: 라우터 설정과 ignore 정리**

Write `tsr.config.json`:

```json
{
  "routesDirectory": "./src/routes",
  "generatedRouteTree": "./src/routeTree.gen.ts",
  "quoteStyle": "double",
  "semicolons": true
}
```

Append to `.gitignore`:

```gitignore

# Local agent artifacts
.superpowers/
.worktrees/

# Test and build output
coverage/
*.tsbuildinfo
```

- [ ] **Step 10: 기존 설정 파일 제거**

Run:

```bash
rm -f postcss.config.js tailwind.config.js src/App.css
```

Expected:

```txt
postcss.config.js, tailwind.config.js, src/App.css removed when present
```

- [ ] **Step 11: 설정 검증**

Run:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm format:check
```

Expected:

```txt
typecheck, lint, format:check complete without configuration loading errors
```

초기 source 재구성 전에는 missing module 오류가 날 수 있다. 이 경우 Task 2 이후 다시 실행한다.

- [ ] **Step 12: Commit**

Run:

```bash
git add .gitignore mise.toml package.json pnpm-lock.yaml vite.config.ts vitest.config.ts eslint.config.js prettier.config.js tsconfig.json tsconfig.app.json tsconfig.node.json tsconfig.vitest.json tsr.config.json
git add -u postcss.config.js tailwind.config.js src/App.css
git commit -m "chore: modernize React project tooling"
```

---

## Task 2: 테스트 기반 shared utility와 test harness 구성

**Files:**
- Create: `src/shared/lib/cn.test.ts`
- Create: `src/shared/lib/format-date.test.ts`
- Create: `src/shared/lib/cn.ts`
- Create: `src/shared/lib/format-date.ts`
- Create: `src/shared/lib/test/test-query-client.ts`
- Create: `src/shared/lib/test/render-with-providers.tsx`
- Create: `src/test/setup.ts`

- [ ] **Step 1: `cn` 실패 테스트 작성**

Write `src/shared/lib/cn.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { cn } from "@/shared/lib/cn";

describe("cn", () => {
  it("조건부 class와 Tailwind 충돌 class를 정리한다", () => {
    expect(cn("px-2 text-sm", false && "hidden", "px-4")).toBe(
      "text-sm px-4",
    );
  });
});
```

- [ ] **Step 2: 실패 확인**

Run:

```bash
pnpm test src/shared/lib/cn.test.ts
```

Expected:

```txt
FAIL src/shared/lib/cn.test.ts
Cannot find module '@/shared/lib/cn'
```

- [ ] **Step 3: `cn` 구현**

Write `src/shared/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: `cn` 통과 확인**

Run:

```bash
pnpm test src/shared/lib/cn.test.ts
```

Expected:

```txt
PASS src/shared/lib/cn.test.ts
```

- [ ] **Step 5: `formatDate` 실패 테스트 작성**

Write `src/shared/lib/format-date.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { formatDate } from "@/shared/lib/format-date";

describe("formatDate", () => {
  it("ISO 날짜를 한국어 UI에 맞는 짧은 날짜로 변환한다", () => {
    expect(formatDate("2026-07-02")).toBe("2026. 07. 02.");
  });
});
```

- [ ] **Step 6: 실패 확인**

Run:

```bash
pnpm test src/shared/lib/format-date.test.ts
```

Expected:

```txt
FAIL src/shared/lib/format-date.test.ts
Cannot find module '@/shared/lib/format-date'
```

- [ ] **Step 7: `formatDate` 구현**

Write `src/shared/lib/format-date.ts`:

```ts
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(`${value}T00:00:00+09:00`));
}
```

- [ ] **Step 8: test setup 작성**

Write `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

MSW lifecycle은 `src/mocks/server.ts`가 생기는 Task 4에서 이 파일에 추가한다.

- [ ] **Step 9: test helper 작성**

Write `src/shared/lib/test/test-query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
```

Write `src/shared/lib/test/render-with-providers.tsx`:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { createTestQueryClient } from "@/shared/lib/test/test-query-client";

function TestProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: TestProviders, ...options });
}
```

- [ ] **Step 10: Commit**

Run:

```bash
git add src/shared/lib src/test/setup.ts
git commit -m "test: add shared test utilities"
```

---

## Task 3: 프로젝트 도메인 모델, schema, utility 구현

**Files:**
- Create: `src/features/projects/__tests__/project-schema.test.ts`
- Create: `src/features/projects/__tests__/project-utils.test.ts`
- Create: `src/features/projects/model/project-types.ts`
- Create: `src/features/projects/model/project-schema.ts`
- Create: `src/features/projects/model/project-utils.ts`
- Create: `src/mocks/data/projects.ts`

- [ ] **Step 1: schema 실패 테스트 작성**

Write `src/features/projects/__tests__/project-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { createProjectSchema } from "@/features/projects/model/project-schema";

describe("createProjectSchema", () => {
  it("프로젝트 생성 입력을 검증한다", () => {
    const result = createProjectSchema.safeParse({
      name: "Design System",
      owner: "Mina",
      status: "active",
      dueDate: "2026-08-01",
      description: "공통 UI 기반을 정리한다.",
    });

    expect(result.success).toBe(true);
  });

  it("짧은 이름과 잘못된 상태를 거부한다", () => {
    const result = createProjectSchema.safeParse({
      name: "A",
      owner: "",
      status: "unknown",
      dueDate: "not-date",
      description: "",
    });

    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: utility 실패 테스트 작성**

Write `src/features/projects/__tests__/project-utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import type { Project } from "@/features/projects/model/project-types";
import {
  filterProjects,
  getProjectStatusCounts,
  sortProjects,
} from "@/features/projects/model/project-utils";

const projects: Project[] = [
  {
    id: "p-1",
    name: "Design System",
    owner: "Mina",
    status: "active",
    dueDate: "2026-08-01",
    description: "공통 UI 기반",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "p-2",
    name: "Billing Revamp",
    owner: "Joon",
    status: "paused",
    dueDate: "2026-07-20",
    description: "결제 플로우 정리",
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
];

describe("project-utils", () => {
  it("검색어와 상태로 프로젝트를 필터링한다", () => {
    expect(
      filterProjects(projects, { search: "design", status: "active" }),
    ).toHaveLength(1);
  });

  it("마감일 오름차순으로 정렬한다", () => {
    expect(sortProjects(projects, "dueDate")[0]?.id).toBe("p-2");
  });

  it("상태별 개수를 계산한다", () => {
    expect(getProjectStatusCounts(projects)).toEqual({
      active: 1,
      paused: 1,
      completed: 0,
    });
  });
});
```

- [ ] **Step 3: 실패 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/project-schema.test.ts src/features/projects/__tests__/project-utils.test.ts
```

Expected:

```txt
FAIL Cannot find module '@/features/projects/model/project-schema'
FAIL Cannot find module '@/features/projects/model/project-utils'
```

- [ ] **Step 4: 타입과 schema 구현**

Write `src/features/projects/model/project-types.ts`:

```ts
export const projectStatuses = ["active", "paused", "completed"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  dueDate: string;
  description: string;
  updatedAt: string;
};

export type CreateProjectInput = {
  name: string;
  owner: string;
  status: ProjectStatus;
  dueDate: string;
  description: string;
};

export type ProjectFilters = {
  search: string;
  status: ProjectStatus | "all";
};

export type ProjectSortKey = "name" | "dueDate" | "updatedAt";
```

Write `src/features/projects/model/project-schema.ts`:

```ts
import { z } from "zod";

import { projectStatuses } from "@/features/projects/model/project-types";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "프로젝트 이름은 2자 이상이어야 합니다."),
  owner: z.string().trim().min(1, "담당자를 입력해주세요."),
  status: z.enum(projectStatuses),
  dueDate: z.iso.date("마감일을 YYYY-MM-DD 형식으로 입력해주세요."),
  description: z.string().trim().min(1, "설명을 입력해주세요.").max(120),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
```

- [ ] **Step 5: utility 구현**

Write `src/features/projects/model/project-utils.ts`:

```ts
import type {
  Project,
  ProjectFilters,
  ProjectSortKey,
  ProjectStatus,
} from "@/features/projects/model/project-types";

export function filterProjects(projects: Project[], filters: ProjectFilters) {
  const search = filters.search.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesSearch =
      search.length === 0 ||
      project.name.toLowerCase().includes(search) ||
      project.owner.toLowerCase().includes(search);
    const matchesStatus =
      filters.status === "all" || project.status === filters.status;

    return matchesSearch && matchesStatus;
  });
}

export function sortProjects(projects: Project[], sortKey: ProjectSortKey) {
  return [...projects].sort((a, b) => {
    if (sortKey === "name") {
      return a.name.localeCompare(b.name);
    }

    return a[sortKey].localeCompare(b[sortKey]);
  });
}

export function getProjectStatusCounts(projects: Project[]) {
  const initial: Record<ProjectStatus, number> = {
    active: 0,
    paused: 0,
    completed: 0,
  };

  return projects.reduce((counts, project) => {
    counts[project.status] += 1;
    return counts;
  }, initial);
}
```

- [ ] **Step 6: fixture 구현**

Write `src/mocks/data/projects.ts`:

```ts
import type { Project } from "@/features/projects/model/project-types";

export const projectsFixture: Project[] = [
  {
    id: "project-design-system",
    name: "Design System",
    owner: "Mina",
    status: "active",
    dueDate: "2026-08-01",
    description: "공통 UI 컴포넌트와 토큰을 정리합니다.",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "project-dashboard-refresh",
    name: "Dashboard Refresh",
    owner: "Joon",
    status: "active",
    dueDate: "2026-07-24",
    description: "운영 대시보드의 정보 구조를 개선합니다.",
    updatedAt: "2026-06-28T09:00:00.000Z",
  },
  {
    id: "project-billing-revamp",
    name: "Billing Revamp",
    owner: "Ara",
    status: "paused",
    dueDate: "2026-09-12",
    description: "결제 플로우를 단순화합니다.",
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "project-onboarding",
    name: "Onboarding Flow",
    owner: "Hwan",
    status: "completed",
    dueDate: "2026-06-30",
    description: "신규 사용자 온보딩을 개선합니다.",
    updatedAt: "2026-06-30T09:00:00.000Z",
  },
];
```

- [ ] **Step 7: 통과 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/project-schema.test.ts src/features/projects/__tests__/project-utils.test.ts
```

Expected:

```txt
PASS src/features/projects/__tests__/project-schema.test.ts
PASS src/features/projects/__tests__/project-utils.test.ts
```

- [ ] **Step 8: Commit**

Run:

```bash
git add src/features/projects src/mocks/data/projects.ts
git commit -m "feat: add project domain model"
```

---

## Task 4: MSW mock API와 project API/query 계층 구성

**Files:**
- Create: `src/features/projects/__tests__/project-api.integration.test.ts`
- Create: `src/mocks/handlers.ts`
- Create: `src/mocks/server.ts`
- Create: `src/mocks/browser.ts`
- Create: `src/features/projects/api/project-api.ts`
- Create: `src/features/projects/queries/project-queries.ts`
- Modify: `src/test/setup.ts`

- [ ] **Step 1: API integration 실패 테스트 작성**

Write `src/features/projects/__tests__/project-api.integration.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  createProject,
  getProject,
  getProjects,
  updateProjectStatus,
} from "@/features/projects/api/project-api";

describe("project-api", () => {
  it("프로젝트 목록을 HTTP boundary를 통해 가져온다", async () => {
    const projects = await getProjects();

    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("id");
  });

  it("프로젝트를 생성하고 상세 조회를 할 수 있다", async () => {
    const created = await createProject({
      name: "Search Experience",
      owner: "Nari",
      status: "active",
      dueDate: "2026-10-01",
      description: "검색 경험을 개선합니다.",
    });

    const detail = await getProject(created.id);

    expect(detail.name).toBe("Search Experience");
  });

  it("프로젝트 상태를 변경한다", async () => {
    const updated = await updateProjectStatus("project-design-system", "paused");

    expect(updated.status).toBe("paused");
  });
});
```

- [ ] **Step 2: 실패 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/project-api.integration.test.ts
```

Expected:

```txt
FAIL Cannot find module '@/features/projects/api/project-api'
```

- [ ] **Step 3: MSW handler 구현**

Write `src/mocks/handlers.ts`:

```ts
import { http, HttpResponse } from "msw";

import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { projectsFixture } from "@/mocks/data/projects";

let projects: Project[] = structuredClone(projectsFixture);

export function resetProjectsMockData() {
  projects = structuredClone(projectsFixture);
}

export const handlers = [
  http.get("/api/projects", () => {
    return HttpResponse.json(projects);
  }),

  http.get("/api/projects/:projectId", ({ params }) => {
    const project = projects.find((item) => item.id === params.projectId);

    if (!project) {
      return HttpResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json(project);
  }),

  http.post("/api/projects", async ({ request }) => {
    const body = (await request.json()) as CreateProjectInput;
    const project: Project = {
      ...body,
      id: `project-${crypto.randomUUID()}`,
      updatedAt: new Date().toISOString(),
    };

    projects = [project, ...projects];

    return HttpResponse.json(project, { status: 201 });
  }),

  http.patch("/api/projects/:projectId/status", async ({ params, request }) => {
    const body = (await request.json()) as { status: ProjectStatus };
    const project = projects.find((item) => item.id === params.projectId);

    if (!project) {
      return HttpResponse.json(
        { message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const updated: Project = {
      ...project,
      status: body.status,
      updatedAt: new Date().toISOString(),
    };

    projects = projects.map((item) => (item.id === updated.id ? updated : item));

    return HttpResponse.json(updated);
  }),
];
```

- [ ] **Step 4: MSW setup 구현**

Write `src/mocks/server.ts`:

```ts
import { setupServer } from "msw/node";

import { handlers, resetProjectsMockData } from "@/mocks/handlers";

export const server = setupServer(...handlers);

export { resetProjectsMockData };
```

Write `src/mocks/browser.ts`:

```ts
import { setupWorker } from "msw/browser";

import { handlers } from "@/mocks/handlers";

export const worker = setupWorker(...handlers);
```

Update `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";

import { resetProjectsMockData, server } from "@/mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetProjectsMockData();
});

afterAll(() => {
  server.close();
});
```

- [ ] **Step 5: API 함수 구현**

Write `src/features/projects/api/project-api.ts`:

```ts
import type {
  CreateProjectInput,
  Project,
  ProjectStatus,
} from "@/features/projects/model/project-types";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(error?.message ?? "요청을 처리하지 못했습니다.");
  }

  return response.json() as Promise<T>;
}

export async function getProjects() {
  const response = await fetch("/api/projects");
  return parseResponse<Project[]>(response);
}

export async function getProject(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}`);
  return parseResponse<Project>(response);
}

export async function createProject(input: CreateProjectInput) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<Project>(response);
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  const response = await fetch(`/api/projects/${projectId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseResponse<Project>(response);
}
```

- [ ] **Step 6: query hook 구현**

Write `src/features/projects/queries/project-queries.ts`:

```ts
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
  getProject,
  getProjects,
  updateProjectStatus,
} from "@/features/projects/api/project-api";
import type {
  CreateProjectInput,
  ProjectStatus,
} from "@/features/projects/model/project-types";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  detail: (projectId: string) => [...projectKeys.all, "detail", projectId] as const,
};

export function projectsQueryOptions() {
  return queryOptions({
    queryKey: projectKeys.lists(),
    queryFn: getProjects,
  });
}

export function projectQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProject(projectId),
  });
}

export function useProjectsQuery() {
  return useQuery(projectsQueryOptions());
}

export function useProjectQuery(projectId: string) {
  return useQuery(projectQueryOptions(projectId));
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProjectStatusMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ProjectStatus) => updateProjectStatus(projectId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
}
```

- [ ] **Step 7: 통과 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/project-api.integration.test.ts
```

Expected:

```txt
PASS src/features/projects/__tests__/project-api.integration.test.ts
```

- [ ] **Step 8: Commit**

Run:

```bash
git add src/mocks src/test/setup.ts src/features/projects/api src/features/projects/queries src/features/projects/__tests__/project-api.integration.test.ts
git commit -m "feat: add MSW project API"
```

---

## Task 5: shared UI primitive와 project status component 구현

**Files:**
- Create: `src/features/projects/__tests__/ProjectStatusBadge.test.tsx`
- Create: `src/shared/ui/button.tsx`
- Create: `src/shared/ui/badge.tsx`
- Create: `src/shared/ui/card.tsx`
- Create: `src/shared/ui/dialog.tsx`
- Create: `src/shared/ui/input.tsx`
- Create: `src/shared/ui/label.tsx`
- Create: `src/shared/ui/select.tsx`
- Create: `src/shared/ui/skeleton.tsx`
- Create: `src/features/projects/components/ProjectStatusBadge.tsx`

- [ ] **Step 1: status badge 실패 테스트 작성**

Write `src/features/projects/__tests__/ProjectStatusBadge.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("ProjectStatusBadge", () => {
  it("active 상태를 한국어 label로 보여준다", () => {
    renderWithProviders(<ProjectStatusBadge status="active" />);

    expect(screen.getByText("진행 중")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/ProjectStatusBadge.test.tsx
```

Expected:

```txt
FAIL Cannot find module '@/features/projects/components/ProjectStatusBadge'
```

- [ ] **Step 3: shared UI primitive 구현**

Write `src/shared/ui/button.tsx`:

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-950",
        secondary: "bg-slate-100 text-slate-950 hover:bg-slate-200 focus-visible:outline-slate-400",
        ghost: "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}
```

Write `src/shared/ui/badge.tsx`:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-slate-100 text-slate-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-800",
        info: "bg-sky-100 text-sky-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ className, variant }))} {...props} />
  );
}
```

Write the remaining shared UI files with these exports:

```tsx
// src/shared/ui/input.tsx
import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50",
        className,
      )}
      {...props}
    />
  );
}
```

```tsx
// src/shared/ui/label.tsx
import type { LabelHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-700", className)}
      {...props}
    />
  );
}
```

```tsx
// src/shared/ui/card.tsx
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-slate-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}
```

```tsx
// src/shared/ui/skeleton.tsx
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}
```

```tsx
// src/shared/ui/select.tsx
import type { SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
        className,
      )}
      {...props}
    />
  );
}
```

```tsx
// src/shared/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl outline-none",
          className,
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
```

- [ ] **Step 4: ProjectStatusBadge 구현**

Write `src/features/projects/components/ProjectStatusBadge.tsx`:

```tsx
import type { ProjectStatus } from "@/features/projects/model/project-types";
import { Badge } from "@/shared/ui/badge";

const statusMeta: Record<
  ProjectStatus,
  { label: string; variant: "info" | "warning" | "success" }
> = {
  active: { label: "진행 중", variant: "info" },
  paused: { label: "일시 중지", variant: "warning" },
  completed: { label: "완료", variant: "success" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const meta = statusMeta[status];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
```

- [ ] **Step 5: 통과 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/ProjectStatusBadge.test.tsx
```

Expected:

```txt
PASS src/features/projects/__tests__/ProjectStatusBadge.test.tsx
```

- [ ] **Step 6: Commit**

Run:

```bash
git add src/shared/ui src/features/projects/components/ProjectStatusBadge.tsx src/features/projects/__tests__/ProjectStatusBadge.test.tsx
git commit -m "feat: add shared UI primitives"
```

---

## Task 6: Zustand UI store 구현

**Files:**
- Create: `src/stores/ui-store.test.ts`
- Create: `src/stores/ui-store.ts`

- [ ] **Step 1: store 실패 테스트 작성**

Write `src/stores/ui-store.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";

import { useUiStore } from "@/stores/ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({
      density: "comfortable",
      sidebarOpen: true,
      theme: "light",
    });
  });

  it("sidebar open 상태를 toggle한다", () => {
    useUiStore.getState().toggleSidebar();

    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });

  it("theme과 density를 설정한다", () => {
    useUiStore.getState().setTheme("dark");
    useUiStore.getState().setDensity("compact");

    expect(useUiStore.getState().theme).toBe("dark");
    expect(useUiStore.getState().density).toBe("compact");
  });
});
```

- [ ] **Step 2: 실패 확인**

Run:

```bash
pnpm test src/stores/ui-store.test.ts
```

Expected:

```txt
FAIL Cannot find module '@/stores/ui-store'
```

- [ ] **Step 3: store 구현**

Write `src/stores/ui-store.ts`:

```ts
import { create } from "zustand";

type Theme = "light" | "dark" | "system";
type Density = "comfortable" | "compact";

type UiState = {
  sidebarOpen: boolean;
  theme: Theme;
  density: Density;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  theme: "light",
  density: "comfortable",
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => set({ theme }),
  setDensity: (density) => set({ density }),
}));
```

- [ ] **Step 4: 통과 확인**

Run:

```bash
pnpm test src/stores/ui-store.test.ts
```

Expected:

```txt
PASS src/stores/ui-store.test.ts
```

- [ ] **Step 5: Commit**

Run:

```bash
git add src/stores
git commit -m "feat: add UI state store"
```

---

## Task 7: 앱 provider, 스타일, 라우터, 레이아웃 구성

**Files:**
- Create: `src/layouts/DashboardLayout.test.tsx`
- Modify: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/router.tsx`
- Create: `src/app/providers/AppProviders.tsx`
- Create: `src/app/providers/QueryProvider.tsx`
- Create: `src/app/styles/index.css`
- Create: `src/layouts/DashboardLayout.tsx`
- Create: `src/layouts/AuthLayout.tsx`
- Create: `src/routes/__root.tsx`
- Create: `src/routes/signin.tsx`
- Create: `src/routes/_dashboard.tsx`
- Create: `src/routes/_dashboard/index.tsx`
- Create: `src/routes/_dashboard/projects.index.tsx`
- Create: `src/routes/_dashboard/projects.$projectId.tsx`
- Create: `src/routes/_dashboard/settings.tsx`
- Delete or replace old route files under `src/routes/_defaultLayout*`
- Regenerate: `src/routeTree.gen.ts`

- [ ] **Step 1: layout 실패 테스트 작성**

Write `src/layouts/DashboardLayout.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  Outlet: () => <div data-testid="outlet" />,
}));

describe("DashboardLayout", () => {
  it("sidebar navigation과 main 영역을 렌더링한다", () => {
    renderWithProviders(<DashboardLayout />);

    expect(screen.getByRole("navigation", { name: "주요 메뉴" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run:

```bash
pnpm test src/layouts/DashboardLayout.test.tsx
```

Expected:

```txt
FAIL Cannot find module '@/layouts/DashboardLayout'
```

- [ ] **Step 3: Tailwind v4 stylesheet 작성**

Write `src/app/styles/index.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
input,
select,
textarea {
  font: inherit;
}
```

- [ ] **Step 4: provider 구현**

Write `src/app/providers/QueryProvider.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

Write `src/app/providers/AppProviders.tsx`:

```tsx
import type { ReactNode } from "react";

import { QueryProvider } from "@/app/providers/QueryProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
```

- [ ] **Step 5: layout 구현**

Write `src/layouts/DashboardLayout.tsx`:

```tsx
import { Link, Outlet } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { useUiStore } from "@/stores/ui-store";
import { Button } from "@/shared/ui/button";

const navItems = [
  { to: "/", label: "대시보드" },
  { to: "/projects", label: "프로젝트" },
  { to: "/settings", label: "설정" },
] as const;

export function DashboardLayout() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white p-4 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-8 text-lg font-semibold">ProjectHub</div>
        <nav aria-label="주요 메뉴" className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              activeProps={{ className: "bg-slate-950 text-white hover:bg-slate-950" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <Button
            aria-label="사이드바 열기"
            size="icon"
            type="button"
            variant="ghost"
            onClick={toggleSidebar}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <div className="text-sm text-slate-500">React Sample Dashboard</div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

Dependency note: add `lucide-react` before this step if it is not installed.

Run:

```bash
pnpm add lucide-react@latest
```

Write `src/layouts/AuthLayout.tsx`:

```tsx
import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {children ?? <Outlet />}
    </main>
  );
}
```

- [ ] **Step 6: router와 route 파일 작성**

Write `src/app/router.tsx`:

```tsx
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

Write `src/app/App.tsx`:

```tsx
import { RouterProvider } from "@tanstack/react-router";

import { AppProviders } from "@/app/providers/AppProviders";
import { router } from "@/app/router";

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
```

Write `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import "@/app/styles/index.css";

async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import("@/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
```

Route files:

```tsx
// src/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <Outlet />,
});
```

```tsx
// src/routes/_dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";

import { DashboardLayout } from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});
```

```tsx
// src/routes/_dashboard/index.tsx
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
});
```

```tsx
// src/routes/_dashboard/projects.index.tsx
import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";

export const Route = createFileRoute("/_dashboard/projects/")({
  component: ProjectsPage,
});
```

```tsx
// src/routes/_dashboard/projects.$projectId.tsx
import { createFileRoute } from "@tanstack/react-router";

import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";

export const Route = createFileRoute("/_dashboard/projects/$projectId")({
  component: ProjectDetailPage,
});
```

```tsx
// src/routes/_dashboard/settings.tsx
import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "@/features/settings/pages/SettingsPage";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});
```

```tsx
// src/routes/signin.tsx
import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/layouts/AuthLayout";

export const Route = createFileRoute("/signin")({
  component: AuthLayout,
});
```

- [ ] **Step 7: 기존 route 삭제와 route tree 재생성**

Run:

```bash
rm -rf src/routes/_defaultLayout src/routes/_defaultLayout.tsx
pnpm generate-routes
```

Expected:

```txt
src/routeTree.gen.ts generated
```

- [ ] **Step 8: layout 테스트 통과 확인**

Run:

```bash
pnpm test src/layouts/DashboardLayout.test.tsx
```

Expected:

```txt
PASS src/layouts/DashboardLayout.test.tsx
```

- [ ] **Step 9: Commit**

Run:

```bash
git add src/main.tsx src/app src/layouts src/routes src/routeTree.gen.ts package.json pnpm-lock.yaml
git add -u src/routes
git commit -m "feat: add dashboard app shell"
```

---

## Task 8: 프로젝트 목록, 생성 Dialog, 상세 화면 구현

**Files:**
- Create: `src/features/projects/__tests__/CreateProjectDialog.test.tsx`
- Create: `src/features/projects/__tests__/ProjectsPage.integration.test.tsx`
- Create: `src/features/projects/components/CreateProjectDialog.tsx`
- Create: `src/features/projects/components/ProjectCard.tsx`
- Create: `src/features/projects/components/ProjectFilters.tsx`
- Create: `src/features/projects/hooks/use-project-filters.ts`
- Create: `src/features/projects/pages/ProjectsPage.tsx`
- Create: `src/features/projects/pages/ProjectDetailPage.tsx`

- [ ] **Step 1: CreateProjectDialog 실패 테스트 작성**

Write `src/features/projects/__tests__/CreateProjectDialog.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("CreateProjectDialog", () => {
  it("필수 입력이 없으면 validation message를 보여준다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateProjectDialog />);
    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(screen.getByText("프로젝트 이름은 2자 이상이어야 합니다.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: ProjectsPage integration 실패 테스트 작성**

Write `src/features/projects/__tests__/ProjectsPage.integration.test.tsx`:

```tsx
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    params,
    to,
    ...props
  }: {
    children: React.ReactNode;
    params?: { projectId?: string };
    to: string;
  }) => (
    <a href={to.replace("$projectId", params?.projectId ?? "")} {...props}>
      {children}
    </a>
  ),
}));

describe("ProjectsPage", () => {
  it("프로젝트 목록을 가져와 렌더링한다", async () => {
    renderWithProviders(<ProjectsPage />);

    expect(await screen.findByText("Design System")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Refresh")).toBeInTheDocument();
  });

  it("사용자 입력으로 프로젝트를 생성하고 목록에 반영한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ProjectsPage />);
    await screen.findByText("Design System");

    await user.click(screen.getByRole("button", { name: "프로젝트 생성" }));
    await user.type(screen.getByLabelText("프로젝트 이름"), "Search Experience");
    await user.type(screen.getByLabelText("담당자"), "Nari");
    await user.selectOptions(screen.getByLabelText("상태"), "active");
    await user.type(screen.getByLabelText("마감일"), "2026-10-01");
    await user.type(screen.getByLabelText("설명"), "검색 경험을 개선합니다.");
    await user.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(screen.getByText("Search Experience")).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 3: 실패 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/CreateProjectDialog.test.tsx src/features/projects/__tests__/ProjectsPage.integration.test.tsx
```

Expected:

```txt
FAIL Cannot find module '@/features/projects/components/CreateProjectDialog'
FAIL Cannot find module '@/features/projects/pages/ProjectsPage'
```

- [ ] **Step 4: filter hook 구현**

Write `src/features/projects/hooks/use-project-filters.ts`:

```ts
import { useMemo, useState } from "react";

import type {
  Project,
  ProjectFilters,
  ProjectSortKey,
} from "@/features/projects/model/project-types";
import {
  filterProjects,
  sortProjects,
} from "@/features/projects/model/project-utils";

export function useProjectFilters(projects: Project[]) {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "all",
  });
  const [sortKey, setSortKey] = useState<ProjectSortKey>("dueDate");

  const visibleProjects = useMemo(() => {
    return sortProjects(filterProjects(projects, filters), sortKey);
  }, [filters, projects, sortKey]);

  return {
    filters,
    setFilters,
    sortKey,
    setSortKey,
    visibleProjects,
  };
}
```

- [ ] **Step 5: project components 구현**

Write `src/features/projects/components/ProjectCard.tsx`:

```tsx
import { Link } from "@tanstack/react-router";

import type { Project } from "@/features/projects/model/project-types";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { formatDate } from "@/shared/lib/format-date";
import { Card } from "@/shared/ui/card";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="text-base font-semibold text-slate-950 hover:underline"
          >
            {project.name}
          </Link>
          <p className="mt-1 text-sm text-slate-500">{project.description}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">담당자</dt>
          <dd className="font-medium text-slate-900">{project.owner}</dd>
        </div>
        <div>
          <dt className="text-slate-500">마감일</dt>
          <dd className="font-medium text-slate-900">{formatDate(project.dueDate)}</dd>
        </div>
      </dl>
    </Card>
  );
}
```

Write `src/features/projects/components/ProjectFilters.tsx`:

```tsx
import type {
  ProjectFilters,
  ProjectSortKey,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

type Props = {
  filters: ProjectFilters;
  sortKey: ProjectSortKey;
  onFiltersChange: (filters: ProjectFilters) => void;
  onSortKeyChange: (sortKey: ProjectSortKey) => void;
};

export function ProjectFilters({
  filters,
  onFiltersChange,
  onSortKeyChange,
  sortKey,
}: Props) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">
      <div>
        <Label htmlFor="project-search">검색</Label>
        <Input
          id="project-search"
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="프로젝트 또는 담당자 검색"
        />
      </div>
      <div>
        <Label htmlFor="project-status">상태</Label>
        <Select
          id="project-status"
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              status: event.target.value as ProjectStatus | "all",
            })
          }
        >
          <option value="all">전체</option>
          <option value="active">진행 중</option>
          <option value="paused">일시 중지</option>
          <option value="completed">완료</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="project-sort">정렬</Label>
        <Select
          id="project-sort"
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value as ProjectSortKey)}
        >
          <option value="dueDate">마감일</option>
          <option value="updatedAt">최근 수정</option>
          <option value="name">이름</option>
        </Select>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: CreateProjectDialog 구현**

Write `src/features/projects/components/CreateProjectDialog.tsx`:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "@/features/projects/model/project-schema";
import { useCreateProjectMutation } from "@/features/projects/queries/project-queries";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

const defaultValues: CreateProjectFormValues = {
  name: "",
  owner: "",
  status: "active",
  dueDate: "",
  description: "",
};

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateProjectMutation();
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  });

  async function onSubmit(values: CreateProjectFormValues) {
    await mutation.mutateAsync(values);
    form.reset(defaultValues);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">프로젝트 생성</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>프로젝트 생성</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-slate-500">
          샘플 mutation과 form validation을 확인할 수 있습니다.
        </DialogDescription>
        <form className="mt-5 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-1.5">
            <Label htmlFor="name">프로젝트 이름</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="owner">담당자</Label>
            <Input id="owner" {...form.register("owner")} />
            {form.formState.errors.owner ? (
              <p className="text-sm text-red-600">{form.formState.errors.owner.message}</p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="status">상태</Label>
            <Select id="status" {...form.register("status")}>
              <option value="active">진행 중</option>
              <option value="paused">일시 중지</option>
              <option value="completed">완료</option>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dueDate">마감일</Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
            {form.formState.errors.dueDate ? (
              <p className="text-sm text-red-600">{form.formState.errors.dueDate.message}</p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">설명</Label>
            <Input id="description" {...form.register("description")} />
            {form.formState.errors.description ? (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                취소
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 7: ProjectsPage와 detail 구현**

Write `src/features/projects/pages/ProjectsPage.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";

import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectFilters } from "@/features/projects/components/ProjectFilters";
import { useProjectFilters } from "@/features/projects/hooks/use-project-filters";
import { projectsQueryOptions } from "@/features/projects/queries/project-queries";
import { Skeleton } from "@/shared/ui/skeleton";

export function ProjectsPage() {
  const query = useQuery(projectsQueryOptions());
  const projects = query.data ?? [];
  const { filters, setFilters, setSortKey, sortKey, visibleProjects } =
    useProjectFilters(projects);

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" aria-label="프로젝트 로딩 중" />;
  }

  if (query.isError) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        프로젝트 목록을 불러오지 못했습니다.
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">프로젝트</h1>
          <p className="mt-1 text-sm text-slate-500">
            서버 상태, 필터링, mutation 흐름을 확인하는 예제입니다.
          </p>
        </div>
        <CreateProjectDialog />
      </div>
      <ProjectFilters
        filters={filters}
        sortKey={sortKey}
        onFiltersChange={setFilters}
        onSortKeyChange={setSortKey}
      />
      {visibleProjects.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          조건에 맞는 프로젝트가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
```

Write `src/features/projects/pages/ProjectDetailPage.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { projectQueryOptions } from "@/features/projects/queries/project-queries";
import { formatDate } from "@/shared/lib/format-date";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/_dashboard/projects/$projectId" });
  const query = useQuery(projectQueryOptions(projectId));

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (query.isError || !query.data) {
    return <Card className="p-6 text-red-700">프로젝트를 찾을 수 없습니다.</Card>;
  }

  const project = query.data;

  return (
    <section className="grid gap-6">
      <div>
        <div className="mb-3">
          <ProjectStatusBadge status={project.status} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        <p className="mt-2 text-slate-500">{project.description}</p>
      </div>
      <Card className="p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-slate-500">담당자</dt>
            <dd className="mt-1 font-medium">{project.owner}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">마감일</dt>
            <dd className="mt-1 font-medium">{formatDate(project.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">최근 수정</dt>
            <dd className="mt-1 font-medium">{formatDate(project.updatedAt.slice(0, 10))}</dd>
          </div>
        </dl>
      </Card>
    </section>
  );
}
```

- [ ] **Step 8: 테스트 통과 확인**

Run:

```bash
pnpm test src/features/projects/__tests__/CreateProjectDialog.test.tsx src/features/projects/__tests__/ProjectsPage.integration.test.tsx
```

Expected:

```txt
PASS src/features/projects/__tests__/CreateProjectDialog.test.tsx
PASS src/features/projects/__tests__/ProjectsPage.integration.test.tsx
```

- [ ] **Step 9: Commit**

Run:

```bash
git add src/features/projects
git commit -m "feat: add project dashboard flow"
```

---

## Task 9: Dashboard, Settings, Signin 화면 완성

**Files:**
- Create: `src/features/dashboard/components/MetricCard.tsx`
- Create: `src/features/dashboard/components/RecentProjects.tsx`
- Create: `src/features/dashboard/pages/DashboardPage.tsx`
- Create: `src/features/settings/pages/SettingsPage.tsx`
- Modify: `src/layouts/AuthLayout.tsx`
- Modify: `src/routes/signin.tsx`

- [ ] **Step 1: dashboard smoke 확인을 위한 구현 작성**

Write `src/features/dashboard/components/MetricCard.tsx`:

```tsx
import { Card } from "@/shared/ui/card";

export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </Card>
  );
}
```

Write `src/features/dashboard/components/RecentProjects.tsx`:

```tsx
import type { Project } from "@/features/projects/model/project-types";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { Card } from "@/shared/ui/card";

export function RecentProjects({ projects }: { projects: Project[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold">최근 프로젝트</h2>
      <div className="mt-4 grid gap-3">
        {projects.slice(0, 3).map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-md border border-slate-100 p-3"
          >
            <div>
              <p className="font-medium text-slate-950">{project.name}</p>
              <p className="text-sm text-slate-500">{project.owner}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
```

Write `src/features/dashboard/pages/DashboardPage.tsx`:

```tsx
import { useQuery } from "@tanstack/react-query";

import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { RecentProjects } from "@/features/dashboard/components/RecentProjects";
import { getProjectStatusCounts } from "@/features/projects/model/project-utils";
import { projectsQueryOptions } from "@/features/projects/queries/project-queries";
import { Skeleton } from "@/shared/ui/skeleton";

export function DashboardPage() {
  const query = useQuery(projectsQueryOptions());

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const projects = query.data ?? [];
  const counts = getProjectStatusCounts(projects);

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
        <p className="mt-1 text-sm text-slate-500">
          실무형 React 템플릿의 핵심 흐름을 압축한 화면입니다.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="전체 프로젝트" value={projects.length} />
        <MetricCard label="진행 중" value={counts.active} />
        <MetricCard label="일시 중지" value={counts.paused} />
        <MetricCard label="완료" value={counts.completed} />
      </div>
      <RecentProjects projects={projects} />
    </section>
  );
}
```

- [ ] **Step 2: SettingsPage 구현**

Write `src/features/settings/pages/SettingsPage.tsx`:

```tsx
import { useUiStore } from "@/stores/ui-store";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

export function SettingsPage() {
  const density = useUiStore((state) => state.density);
  const setDensity = useUiStore((state) => state.setDensity);
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  return (
    <section className="grid max-w-2xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">설정</h1>
        <p className="mt-1 text-sm text-slate-500">
          Zustand가 담당하는 클라이언트 UI 상태 예제입니다.
        </p>
      </div>
      <Card className="grid gap-4 p-6">
        <div className="grid gap-1.5">
          <Label htmlFor="theme">테마</Label>
          <Select
            id="theme"
            value={theme}
            onChange={(event) =>
              setTheme(event.target.value as "light" | "dark" | "system")
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="density">밀도</Label>
          <Select
            id="density"
            value={density}
            onChange={(event) =>
              setDensity(event.target.value as "comfortable" | "compact")
            }
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </Select>
        </div>
      </Card>
    </section>
  );
}
```

- [ ] **Step 3: Signin route를 실제 화면으로 구성**

Update `src/routes/signin.tsx`:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="mt-1 text-sm text-slate-500">
          인증 구현은 범위 밖이며 layout 예제만 제공합니다.
        </p>
        <form className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" autoComplete="current-password" />
          </div>
          <Button type="button">로그인</Button>
        </form>
        <Link to="/" className="mt-4 inline-block text-sm text-slate-600 hover:underline">
          대시보드로 돌아가기
        </Link>
      </Card>
    </AuthLayout>
  );
}
```

- [ ] **Step 4: route tree 재생성 및 smoke 검증**

Run:

```bash
pnpm generate-routes
pnpm typecheck
pnpm test
```

Expected:

```txt
typecheck passes
all tests pass
```

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/dashboard src/features/settings src/routes/signin.tsx src/routeTree.gen.ts
git commit -m "feat: add dashboard and settings pages"
```

---

## Task 10: README, 전체 검증, 마무리

**Files:**
- Modify: `README.md`
- Modify: `PNPM_COMMAND.md` if content is stale
- Review: all generated and changed files

- [ ] **Step 1: README 업데이트**

Write `README.md` with these sections:

```md
# React Sample

실무형 React 프로젝트 템플릿 예제입니다. 프로젝트 대시보드 도메인을 통해 routing, server state, client UI state, form validation, mock API, shared UI, 테스트 구성을 확인할 수 있습니다.

## Stack

- Node.js 24.13.0
- pnpm
- React
- Vite
- TypeScript
- Tailwind CSS v4
- TanStack Router
- TanStack Query
- Zustand
- MSW
- React Hook Form
- Zod
- Vitest
- Testing Library
- ESLint
- Prettier

## Setup

```bash
mise install
corepack enable
pnpm install
```

## Scripts

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm validate
```

## Structure

```txt
src/app        앱 부트스트랩과 provider
src/routes     TanStack Router route 파일
src/layouts    페이지 레이아웃
src/features   기능 단위 코드
src/shared     도메인 독립 UI와 유틸
src/stores     클라이언트 UI 상태
src/mocks      MSW mock API
src/test       테스트 setup
```

## 상태 관리 기준

- 서버 데이터: TanStack Query
- 클라이언트 UI 상태: Zustand
- 폼 상태: React Hook Form
- 입력 검증: Zod
```

- [ ] **Step 2: stale 문서 정리**

If `PNPM_COMMAND.md` still references old Node or Tailwind versions, update it to describe pnpm commands only and remove stale version claims.

- [ ] **Step 3: 전체 format 적용**

Run:

```bash
pnpm format
```

Expected:

```txt
All supported files formatted by Prettier
```

- [ ] **Step 4: 전체 검증**

Run:

```bash
pnpm validate
```

Expected:

```txt
pnpm typecheck passes
pnpm lint passes
pnpm format:check passes
pnpm test passes
pnpm build passes
```

- [ ] **Step 5: 개발 서버 실행 확인**

Run:

```bash
pnpm dev
```

Expected:

```txt
VITE ready
Local: http://localhost:<port>/
```

Open the local URL and verify:

- `/` dashboard renders.
- `/projects` shows project cards.
- Project creation dialog opens.
- Creating a project updates the list.
- `/settings` shows Zustand UI state controls.
- `/signin` renders the auth layout example.

- [ ] **Step 6: Commit**

Run:

```bash
git add README.md PNPM_COMMAND.md package.json pnpm-lock.yaml src docs
git commit -m "docs: document React dashboard template"
```

- [ ] **Step 7: 최종 상태 확인**

Run:

```bash
git status --short --branch
git log --oneline -5
```

Expected:

```txt
## feat/react-dashboard-template
```

Working tree should be clean except intentionally ignored local artifacts.

---

## 자체 검토

### Spec coverage

- Node 24.13.0과 `mise.toml`: Task 1
- pnpm과 package metadata: Task 1
- Tailwind CSS v4: Task 1, Task 7
- TanStack Router 최신화: Task 1, Task 7, Task 9
- TanStack Query: Task 4, Task 8, Task 9
- Zustand: Task 6, Task 7, Task 9
- MSW 기반 mock API: Task 4
- React Hook Form + Zod: Task 3, Task 8
- feature-first 폴더 구조: Task 2부터 Task 9
- 절대경로 import: Task 1 TS/Vite 설정, 모든 source task
- lint, prettier, typecheck, test, build, validate: Task 1, Task 10
- Unit test: Task 2, Task 3, Task 6
- Component test: Task 5, Task 7, Task 8
- Integration test: Task 4, Task 8
- E2E 제외: Task 10 검증에서 dev smoke만 수행

### Placeholder scan

이 계획에는 미정 항목 없이 파일 경로, 명령, 기대 결과, 핵심 코드 내용을 포함한다.

### Type consistency

- `ProjectStatus`는 `"active" | "paused" | "completed"`로 일관되게 사용한다.
- `CreateProjectInput`과 `CreateProjectFormValues`는 Zod schema를 기준으로 맞춘다.
- `ProjectFilters.status`는 `"all"` 또는 `ProjectStatus`로 유지한다.
- Query key는 `projectKeys.all`, `projectKeys.lists()`, `projectKeys.detail(projectId)`로 통일한다.

## 실행 방식 선택

계획 실행은 두 방식 중 하나로 진행한다.

1. Subagent-Driven: task별로 독립 실행 후 리뷰한다. 변경량이 커서 권장한다.
2. Inline Execution: 이 세션에서 task를 순서대로 실행한다. 맥락 전환은 적지만 한 세션의 변경량이 커진다.
