# React Sample

실무형 React 프로젝트 템플릿 예제입니다. 프로젝트 대시보드 도메인을 통해 routing, server state, client UI state, form validation, mock API, shared UI, 테스트 구성을 확인할 수 있습니다.

## Stack

- Node.js 24.13.0
- pnpm
- React 19
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

## Routes

```txt
/                    프로젝트 대시보드
/projects            프로젝트 목록, 필터, 생성 Dialog
/projects/$projectId 프로젝트 상세
/settings            클라이언트 UI 상태 설정
/signin              인증 레이아웃 예제
```

## 상태 관리 기준

- 서버 데이터: TanStack Query
- 클라이언트 UI 상태: Zustand
- 폼 상태: React Hook Form
- 입력 검증: Zod
- API mocking: MSW

## 테스트 범위

- Unit: schema, utility, store, test helper
- Component: shared UI, layout, form dialog, dashboard/settings/signin page
- Integration: MSW 기반 project API와 project creation flow
