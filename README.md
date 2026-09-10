# React Sample

실무형 React 프로젝트 템플릿 예제입니다. 프로젝트 대시보드 도메인을 통해 routing, 인증(보호 라우트), server state, client UI state, form validation, 알림(toast), mock API, shared UI, 코드 스플리팅, 테스트 구성을 확인할 수 있습니다.

## Stack

- Node.js 24.19.0
- pnpm 11.22.0
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
pnpm exec playwright install chromium # E2E 브라우저 최초 1회 설치
cp .env.example .env.local   # 환경변수(선택)
```

환경변수는 `src/shared/config/env.ts`에서 Zod로 검증합니다.

## Mise Tasks

```bash
mise tasks
mise run dev
mise run validate
mise run verify
```

## Scripts

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:coverage    # coverage 임계값 포함
pnpm test:e2e         # Playwright E2E
pnpm storybook        # 컴포넌트 카탈로그 (:6006)
pnpm build-storybook
pnpm build
pnpm validate         # typecheck + lint + format:check + coverage + build
pnpm verify           # validate + Storybook build + E2E
```

## Local Examples

Vite 개발 서버의 기본 포트는 `5173`입니다. 사용 중이면 다음 포트로 이동하므로
터미널에 표시된 주소를 확인하세요.

관리자 경로는 미인증 상태로 접근하면 `/signin`으로 이동합니다. 개발 mock 모드에서는
로그인 폼의 이메일·비밀번호 검증을 통과하면 데모 토큰을 발급합니다.

```txt
http://localhost:5173/signin                         로그인: RHF + Zod + React 19 Action
http://localhost:5173/                               종합 대시보드: 매출·주문·고객 지표
http://localhost:5173/operations                     프로젝트 운영 대시보드
http://localhost:5173/reports                        분석 리포트
http://localhost:5173/projects                       프로젝트 검색·정렬·생성
http://localhost:5173/projects/project-design-system 프로젝트 상세·낙관적 상태 변경
http://localhost:5173/users                          사용자 목록·프로필·접근 권한
http://localhost:5173/products                       상품 관리·이미지·재고
http://localhost:5173/orders                         주문 관리·상태·배송·메모
http://localhost:5173/react-19                       use(Promise)·Context·ref cleanup 예제
http://localhost:5173/docs/getting-started            문서 검색·목차·읽기 진행률
http://localhost:5173/shop                           쇼핑·찜·장바구니·모의 주문
http://localhost:5173/landing                        다양한 랜딩 페이지 카탈로그
```

### API 서버와 mock 모드

- `VITE_ENABLE_MOCKS` 미설정: 개발 서버는 `true`, production build는 `false`입니다.
- Mock 모드: 모든 도메인이 같은 출처의 `/api/...` MSW handler를 사용합니다.
- 실제 API 모드: `apiRequest`가 `VITE_API_BASE_URL` 뒤에 `/api/...` 경로를 붙입니다.
  기본값은 `http://localhost:3000`이고, 끝의 `/`와 base path를 지원합니다.
  직접 전달한 절대 URL·URL 객체·Request는 원래 주소를 유지합니다.
- `.env.local`도 production build에 반영됩니다. 실제 배포에서는 mock을 끄고 API 서버 주소를
  지정하세요. 환경변수는 빌드 시 반영되므로 변경 후 다시 빌드해야 합니다.
- API 서버는 앱 출처에 대한 CORS를 허용해야 합니다. 이 샘플에는 실제 백엔드가 포함되지 않으며,
  쿠키 인증·Bearer 토큰 주입은 사용할 백엔드 계약에 맞춰 별도 연결해야 합니다.

```bash
# 실제 API 연결
VITE_ENABLE_MOCKS=false VITE_API_BASE_URL=http://localhost:3000 pnpm dev
# 실제 배포용 빌드
VITE_ENABLE_MOCKS=false VITE_API_BASE_URL=https://api.example.com pnpm build
# API 서버 없이 샘플을 배포할 때만 mock을 명시적으로 활성화
VITE_ENABLE_MOCKS=true pnpm build
```

환경변수의 적용 시점과 우선순위는 [Vite 환경변수 문서](https://vite.dev/guide/env-and-mode)를 참고하세요.

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

| 경로                                                | 예제                       | 접근 |
| --------------------------------------------------- | -------------------------- | ---- |
| `/`                                                 | 종합 대시보드              | 보호 |
| `/operations`, `/reports`                           | 프로젝트 운영·분석 리포트  | 보호 |
| `/projects`, `/projects/$projectId`                 | 프로젝트 목록·상세         | 보호 |
| `/users`, `/users/$userId`                          | 사용자 목록·상세           | 보호 |
| `/products`, `/products/new`                        | 상품 목록·등록             | 보호 |
| `/products/$productId`, `/products/$productId/edit` | 상품 상세·수정             | 보호 |
| `/orders`, `/orders/$orderId`                       | 주문 목록·상세             | 보호 |
| `/settings`, `/react-19`                            | UI 설정·React 19 예제      | 보호 |
| `/signin`                                           | 데모 로그인                | 공개 |
| `/docs`, `/docs/$slug`                              | 시작 문서로 이동·문서 상세 | 공개 |
| `/shop`, `/shop/$productId`                         | 상품 탐색·상세             | 공개 |
| `/shop/cart`, `/shop/checkout`                      | 장바구니·모의 주문         | 공개 |
| `/landing`                                          | 랜딩 카탈로그              | 공개 |
| `/landing/saas`, `/landing/agency`                  | SaaS·에이전시              | 공개 |
| `/landing/course`, `/landing/event`                 | 온라인 강의·행사           | 공개 |
| `/landing/stay`, `/landing/product`                 | 숙박·제품 소개             | 공개 |

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

- `generate-routes`와 `watch-routes`는 `scripts/router-cli.mjs`에서 Router CLI의 공개 ESM 진입점을 사용합니다. upstream `tsr` 실행 파일의 CommonJS 순환 참조 경고를 피하면서 같은 명령과 종료 코드를 유지합니다.
- Router·CLI·plugin은 서로 다른 버전 번호로 릴리스됩니다. 숫자를 강제로 통일하기보다 lockfile의 core/generator 의존성과 생성·빌드를 함께 검증합니다.
- `vite.config.ts`의 TanStack Router 플러그인 `autoCodeSplitting`으로 각 라우트 컴포넌트가 별도 청크로 분리되어 초기 번들이 작아집니다.

### API 경계

- `src/shared/api/http-client.ts`의 `apiRequest`가 mock 여부에 따라 API 주소를 결정하고 성공 응답을 feature별 Zod schema로 검증합니다.
- HTTP 오류는 `ApiError`로 정규화해 `status`, `code`, `path`, `traceId`를 보존합니다.
- MSW 실패 응답도 같은 오류 형식과 `X-Trace-Id` 헤더를 사용합니다.

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
- Contract: API 성공 응답 schema와 공통 오류/trace ID
- E2E: Playwright 기반 인증, dashboard, route 흐름

## Documents

- [Documents](docs/README.md): 문서 읽기 순서와 목적별 안내
- [Architecture](docs/architecture.md): 폴더 구조, 데이터 흐름, 상태 관리 경계
- [Tech Stack](docs/tech-stack.md): 사용 기술의 역할과 선택 이유
- [Testing](docs/testing.md): 테스트 계층, MSW 구성, 검증 명령
- [Feature Checklist](docs/feature-addition-checklist.md): 새 기능의 배치와 검증 체크리스트
- [Contributing](CONTRIBUTING.md): 개발 워크플로, 커밋 규칙, git hook
