# React Sample

실무형 React 프로젝트 템플릿 예제입니다. 프로젝트 대시보드 도메인을 통해 routing, 인증(보호 라우트), server state, client UI state, form validation, 알림(toast), mock API, shared UI, 코드 스플리팅, 테스트 구성을 확인할 수 있습니다.

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

대시보드 경로(`/`, `/projects`, `/settings`)는 보호 라우트라 미인증 상태로 접근하면 `/signin`으로 리다이렉트됩니다.
데모 로그인은 아무 이메일과 비밀번호로 통과합니다.

```txt
http://localhost:5174/signin                                로그인: 데모 인증(RHF + Zod), 로그인 후 원래 목적지로 복귀
http://localhost:5174/                                      대시보드: TanStack Query로 mock project 데이터를 가져와 metric과 최근 프로젝트를 표시
http://localhost:5174/projects                              프로젝트 목록: 필터, 정렬, 생성 Dialog, mutation 성공 시 toast 알림 확인
http://localhost:5174/projects/project-design-system        프로젝트 상세: route params, detail query, 상태 badge, 날짜 format 유틸 확인
http://localhost:5174/settings                              설정: Zustand client UI state 예제, density 설정 확인
```

## Structure

```txt
src/app        앱 부트스트랩과 provider
src/routes     TanStack Router route 파일
src/layouts    페이지 레이아웃
src/features   기능 단위 코드
src/shared     도메인 독립 UI와 유틸
src/stores     클라이언트 상태 (UI / 인증 / 알림)
src/mocks      MSW mock API
src/test       테스트 setup
```

## Routes

```txt
/                    프로젝트 대시보드          (보호 라우트)
/projects            프로젝트 목록, 생성 Dialog (보호 라우트)
/projects/$projectId 프로젝트 상세             (보호 라우트)
/settings            클라이언트 UI 상태 설정    (보호 라우트)
/signin              데모 로그인 (공개)
```

## 핵심 패턴

### 인증 / 보호 라우트

- `src/stores/auth-store.ts`: 토큰과 사용자 정보를 Zustand `persist`로 localStorage(`react-sample-auth`)에 저장합니다.
- `src/routes/_dashboard.tsx`의 `beforeLoad`가 미인증 접근을 막고 `/signin?redirect=<원래 경로>`로 리다이렉트합니다. 인증 상태는 라우터 `context`(`src/app/router-context.ts`)로 주입됩니다.
- `src/pages/auth/SignInPage.tsx`는 RHF + Zod 로그인 폼이며, 로그인 후 `redirect` 목적지(없으면 `/`)로 이동합니다. MSW `POST /api/login`이 데모 토큰을 발급합니다.
- 헤더의 로그아웃 버튼은 인증 상태를 비우고 `/signin`으로 보냅니다.

### 알림 (Toast)

- `src/stores/toast-store.ts`의 `toast.success/error/info` 헬퍼로 컴포넌트 밖에서도 알림을 띄웁니다.
- `src/shared/ui/toast.tsx`의 `Toaster`를 `AppProviders`에 한 번 마운트하며, 각 토스트는 4초 후 자동으로 사라집니다.
- 프로젝트 생성 성공/실패 시 toast로 피드백합니다.

### 코드 스플리팅

- `vite.config.ts`의 TanStack Router 플러그인 `autoCodeSplitting`으로 각 라우트 컴포넌트가 별도 청크로 분리되어 초기 번들이 작아집니다.

## 상태 관리 기준

- 서버 데이터: TanStack Query
- 클라이언트 UI 상태 / 인증 / 알림: Zustand (`ui-store`, `auth-store`, `toast-store`)
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
