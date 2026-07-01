# React Sample Dashboard Template 설계

## 목표

기존 React 샘플 프로젝트를 최신 실무형 템플릿으로 재구성한다. 예제 앱은 작고 응집도 있는 프로젝트 대시보드로 만들며, React 앱의 구조, 설정, 라우팅, 서버 상태, 클라이언트 UI 상태, 폼, 스타일링, 테스트 패턴을 한 프로젝트 안에서 확인할 수 있게 한다.

## 확정 요구사항

- 기존 소스는 필요하면 삭제하고 새로 구성한다.
- Node.js는 `24.13.0`으로 고정하고 `mise.toml`에 명시한다.
- 패키지 매니저는 `pnpm`을 유지하고, `package.json`의 `packageManager`에 정확한 버전을 기록한다.
- React, Vite, TypeScript, Tailwind CSS v4, TanStack Router, TanStack Query, Zustand, MSW, React Hook Form, Zod를 사용한다.
- UI는 Tailwind와 headless/Radix 스타일 primitive 조합으로 구성한다.
- TanStack Router는 유지하되 최신 파일 기반 라우팅 구조로 재작성한다.
- import는 `@/*` 절대경로 alias를 기본으로 사용한다.
- 레이아웃, route 파일, feature 로직, shared UI, API 호출, query, store, test를 책임별로 분리한다.
- lint, format, typecheck, test, build, validate 스크립트를 포함한다.
- 테스트 범위는 unit, component, integration까지만 포함한다.
- Playwright 같은 E2E 테스트는 이번 범위에 넣지 않는다.
- 예제 도메인은 프로젝트 대시보드로 한다.
- 레이아웃은 고정 사이드바와 상단 툴바를 갖는 app shell로 한다.
- mock API 계층은 MSW로 구성한다.
- 프로젝트 생성 Dialog 하나에 React Hook Form과 Zod 예제를 넣는다.

## 아키텍처 선택

기본 구조는 feature-first 아키텍처로 구성하고, TanStack Router route 파일은 얇게 유지한다.

route 파일은 라우트 경계와 page 연결만 담당한다. 비즈니스 로직, 폼 로직, query 로직, 필터링 로직은 feature 폴더로 위임한다. feature 폴더는 API 호출, query hook, 도메인 schema, 도메인 유틸, feature 전용 UI, page, test를 함께 소유한다. shared UI와 shared utility는 도메인에 의존하지 않게 유지한다.

이 구조는 샘플 프로젝트가 지나치게 커지는 것을 막으면서도, 실제 프로젝트 시작점으로 복사해 쓰기 좋은 형태를 제공한다.

## 검토한 대안

### Feature-First 구조

- 장점:
  - 도메인 관련 파일을 가까이 둘 수 있다.
  - 기능이 늘어날 때 확장성이 좋다.
  - feature 테스트를 찾기 쉽다.
  - route 파일을 얇게 유지하기 좋다.
- 단점:
  - 최소 샘플보다 폴더 수가 많아 보일 수 있다.

### Layer-First 구조

- 장점:
  - 많은 React 개발자에게 익숙하다.
  - 작은 프로젝트에서는 단순하다.
- 단점:
  - 관련 도메인 파일이 `components`, `hooks`, `services`, `pages`로 흩어진다.
  - 기능이 커질수록 유지보수가 어려워진다.

### Route-First 구조

- 장점:
  - 파일 기반 라우팅과 자연스럽게 맞는다.
  - 페이지 단위로 이해하기 쉽다.
- 단점:
  - 재사용 UI, 도메인 로직, route 책임의 경계가 흐려질 수 있다.
  - 공통 model과 API 코드를 배치하기 애매해질 수 있다.

선택안은 feature-first 구조와 얇은 route 파일 조합이다.

## 애플리케이션 라우트

- `/`
  - 대시보드 홈이다.
  - 프로젝트 지표, 최근 프로젝트, 상태별 카운트, 빠른 액션을 보여준다.
- `/projects`
  - 프로젝트 목록 화면이다.
  - TanStack Query로 서버 상태를 조회한다.
  - 검색, 상태 필터, 정렬은 클라이언트 로직으로 처리한다.
  - 프로젝트 생성 Dialog를 열 수 있다.
- `/projects/$projectId`
  - 프로젝트 상세 화면이다.
  - route param을 안정적인 Query key로 연결한다.
- `/settings`
  - UI 설정 예제 화면이다.
  - Zustand로 관리하는 theme, density, sidebar preference를 보여준다.
- `/signin`
  - Auth layout 예제 화면이다.
  - 실제 인증 구현은 포함하지 않는다.

## 레이아웃 설계

app shell 레이아웃을 사용한다.

- 데스크톱 고정 사이드바
- 모바일 사이드바 drawer
- 페이지 제목, 검색 진입점, theme toggle, account 영역을 가진 상단 툴바
- 반응형 spacing을 가진 main content 영역

사이드바 상태는 클라이언트 UI 상태이므로 Zustand가 소유한다. 프로젝트 데이터는 서버 상태이므로 Zustand에 넣지 않고 TanStack Query가 소유한다.

## 데이터 흐름

### Mock API

MSW handler는 다음 API를 제공한다.

- `GET /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects`
- `PATCH /api/projects/:projectId/status`

fixture는 `src/mocks/data`에 둔다. handler는 `src/mocks/handlers.ts`에 둔다. 개발 런타임용 browser setup은 `src/mocks/browser.ts`에 둔다. 테스트용 server setup은 `src/mocks/server.ts`에 둔다.

### Project API 계층

`src/features/projects/api/project-api.ts`는 fetcher 함수만 소유한다. 앱 코드는 MSW를 쓰든 실제 백엔드로 바꾸든 동일한 API 함수를 호출한다.

### Query 계층

`src/features/projects/queries/project-queries.ts`는 다음 항목을 소유한다.

- `projectsQueryOptions`
- `projectQueryOptions`
- `useProjectsQuery`
- `useProjectQuery`
- `useCreateProjectMutation`
- `useUpdateProjectStatusMutation`

mutation 성공 시 관련 project query를 invalidate하거나 필요한 cache를 갱신한다.

### 클라이언트 UI 상태

`src/stores/ui-store.ts`는 다음 상태와 액션을 소유한다.

- `sidebarOpen`
- `theme`
- `density`
- `toggleSidebar`
- `setSidebarOpen`
- `setTheme`
- `setDensity`

이 store에는 프로젝트 데이터, 요청 상태, API 응답 데이터를 넣지 않는다.

## 폼 설계

`CreateProjectDialog`는 다음 패턴을 보여준다.

- shared `Dialog`, `Button`, `Input`, `Label`, form error UI 사용
- React Hook Form 기반 form state
- Zod 기반 validation
- 프로젝트 생성 mutation
- 성공 후 query invalidation
- 성공 후 Dialog 닫기와 form reset

폼 필드는 다음으로 제한한다.

- 프로젝트 이름
- 담당자
- 상태
- 마감일
- 짧은 설명

## 제안 소스 구조

```txt
src/
  app/
    App.tsx
    router.tsx
    providers/
      AppProviders.tsx
      QueryProvider.tsx
    styles/
      index.css
  layouts/
    DashboardLayout.tsx
    AuthLayout.tsx
  routes/
    __root.tsx
    index.tsx
    signin.tsx
    _dashboard.tsx
    _dashboard/
      projects.index.tsx
      projects.$projectId.tsx
      settings.tsx
  features/
    dashboard/
      pages/
        DashboardPage.tsx
      components/
        MetricCard.tsx
        RecentProjects.tsx
    projects/
      api/
        project-api.ts
      components/
        CreateProjectDialog.tsx
        ProjectCard.tsx
        ProjectFilters.tsx
        ProjectStatusBadge.tsx
      hooks/
        use-project-filters.ts
      model/
        project-schema.ts
        project-types.ts
        project-utils.ts
      pages/
        ProjectDetailPage.tsx
        ProjectsPage.tsx
      queries/
        project-queries.ts
      __tests__/
        project-schema.test.ts
        project-utils.test.ts
        CreateProjectDialog.test.tsx
        ProjectsPage.integration.test.tsx
    settings/
      pages/
        SettingsPage.tsx
  shared/
    ui/
      badge.tsx
      button.tsx
      card.tsx
      dialog.tsx
      input.tsx
      label.tsx
      select.tsx
      skeleton.tsx
    lib/
      cn.ts
      format-date.ts
      test/
        render-with-providers.tsx
        test-query-client.ts
  stores/
    ui-store.ts
  mocks/
    browser.ts
    handlers.ts
    server.ts
    data/
      projects.ts
  test/
    setup.ts
  main.tsx
  routeTree.gen.ts
  vite-env.d.ts
```

## 설정 파일

root 레벨 설정 파일은 다음 형태로 구성한다.

```txt
mise.toml
package.json
pnpm-lock.yaml
vite.config.ts
vitest.config.ts
eslint.config.js
prettier.config.js
tsconfig.json
tsconfig.app.json
tsconfig.node.json
tsconfig.vitest.json
tsr.config.json
README.md
```

삭제하거나 대체할 항목은 다음과 같다.

- `src/App.css`
- `src/index.css`의 Tailwind v3 directive
- `tailwind.config.js`
- `postcss.config.js`
- 기존 `src/components/layouts`
- 기존 `src/components/modal`
- 새 route 구조와 충돌하는 기존 route 파일

## 패키지와 도구 방향

runtime과 core dependency는 다음을 사용한다.

- React 19
- Vite 최신 major
- TypeScript 최신 major
- `@tanstack/react-router`
- `@tanstack/router-plugin`
- `@tanstack/router-cli`
- `@tanstack/react-query`
- `zustand`
- `tailwindcss`
- `@tailwindcss/vite`
- Radix primitive
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `msw`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`

development dependency는 다음을 사용한다.

- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`
- `jsdom`
- `eslint`
- `typescript-eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `eslint-plugin-testing-library`
- `prettier`
- `prettier-plugin-tailwindcss`

## 스크립트

스크립트는 다음 형태로 구성한다.

```json
{
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
```

## Tailwind v4 방향

- `@tailwindcss/vite` plugin을 사용한다.
- 앱 stylesheet에는 `@import "tailwindcss";`를 사용한다.
- design token은 CSS variable로 정의한다.
- daisyUI는 제거한다.
- shared UI는 Tailwind utility와 작은 composition helper로 직접 구성한다.

## ESLint와 Prettier 방향

- ESLint flat config를 유지한다.
- ESLint는 코드 품질을 담당한다.
- Prettier는 포맷팅을 담당한다.
- Prettier를 ESLint rule로 실행하지 않는다.
- generated route tree, build output, coverage output, local brainstorm artifact를 ignore한다.
- test file에는 Testing Library lint 지원을 추가한다.

## 테스트 전략

Vitest와 jsdom을 사용한다.

Unit 테스트:

- 프로젝트 schema validation
- 프로젝트 filter와 sort utility
- formatting helper

Component 테스트:

- 동작 검증이 필요한 shared UI primitive
- `ProjectStatusBadge`
- `CreateProjectDialog`

Integration 테스트:

- MSW test server
- 테스트마다 새로 만드는 QueryClientProvider
- 프로젝트 목록 loading
- empty state와 error state
- 사용자 입력부터 mutation 성공과 목록 갱신까지 이어지는 프로젝트 생성 flow

이번 범위에는 E2E 테스트를 넣지 않는다.

## 복잡도

- 프로젝트 필터링: 시간 복잡도 `O(n)`, 공간 복잡도 `O(n)`
- 프로젝트 정렬: 시간 복잡도 `O(n log n)`, 공간 복잡도 `O(n)`
- 프로젝트 목록 렌더링: 시간 복잡도 `O(n)`, 공간 복잡도 `O(n)`
- 프로젝트 상세 렌더링: 응답 데이터가 준비된 뒤 앱 코드 기준 시간 복잡도 `O(1)`, 공간 복잡도 `O(1)`
- Zustand UI 상태 업데이트: 시간 복잡도 `O(1)`, 공간 복잡도 `O(1)`
- 안정적인 Query key 기반 cache 조회: 앱 코드 관점에서 평균 `O(1)`로 취급
- 전체 validate 스크립트: 소스 파일 수 `f`, 테스트 수 `t`, 모듈 그래프 크기 `m` 기준 대략 `O(f + t + m)`

## 주의사항

> - route 파일은 얇게 유지한다. route 파일에 filtering, mutation, form logic이 들어가기 시작하면 feature 폴더로 이동한다.
> - 서버 데이터를 Zustand에 저장하지 않는다. TanStack Query가 request lifecycle, cache, retry, invalidation을 담당한다.
> - `shared`는 도메인에 의존하지 않는다. shared UI와 utility는 project feature type을 import하지 않는다.
> - MSW handler는 직접 in-memory 함수를 호출하는 우회로가 아니라 API boundary로 취급한다.
> - auth route는 layout과 UI 예제로만 유지한다. 실제 인증 구현은 이 템플릿 재구성 범위 밖이다.
> - `src/routeTree.gen.ts`는 직접 수정하지 않는다. TanStack Router CLI로 재생성한다.

## 구현 범위 밖

이번 설계는 다음 항목을 의도적으로 제외한다.

- 실제 백엔드 연동
- 실제 인증
- E2E 브라우저 테스트
- 무거운 charting library
- 서버 데이터를 위한 global state
- 대형 design system

위 항목들은 나중에 확장할 수 있지만, 첫 번째 재구성은 깨끗하고 현대적인 React sample template에 집중한다.
