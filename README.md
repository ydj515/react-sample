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
- Storybook
- Playwright (E2E)
- ESLint
- Prettier
- lefthook (git hooks)
- GitHub Actions (CI)

## Setup

```bash
mise install
corepack enable
pnpm install          # lefthook git hook이 자동 설치됩니다
cp .env.example .env.local   # 환경변수(선택)
```

환경변수는 `src/shared/config/env.ts`에서 Zod로 검증합니다.

## Mise Tasks

```bash
mise tasks
mise run dev
mise run validate
```

## Scripts

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:e2e         # Playwright E2E
pnpm storybook        # 컴포넌트 카탈로그 (:6006)
pnpm build
pnpm validate
```

## Local Examples

아래 URL은 Vite dev server가 `5174` 포트에서 실행 중인 경우를 기준으로 합니다.
다른 포트로 실행되면 포트 번호만 바꿔서 확인하면 됩니다.

```txt
http://localhost:5174/                                      대시보드: TanStack Query로 mock project 데이터를 가져와 metric과 최근 프로젝트를 표시
http://localhost:5174/projects                              프로젝트 목록: 필터, 정렬, React Hook Form + Zod 기반 생성 Dialog, mutation 흐름 확인
http://localhost:5174/projects/project-design-system        프로젝트 상세: route params, detail query, 상태 badge, 날짜 format 유틸 확인
http://localhost:5174/settings                              설정: Zustand client UI state 예제, density 설정 확인
http://localhost:5174/signin                                로그인: 인증 구현 없이 AuthLayout, form field, shared UI 구성을 확인
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

## Documents

- [Architecture](docs/architecture.md): 폴더 구조, 데이터 흐름, 상태 관리 경계
- [Tech Stack](docs/tech-stack.md): 사용 기술의 역할과 선택 이유
- [Testing](docs/testing.md): 테스트 계층, MSW 구성, 검증 명령
- [Contributing](CONTRIBUTING.md): 개발 워크플로, 커밋 규칙, git hook
