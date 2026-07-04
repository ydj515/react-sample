# Architecture

이 문서는 React Sample 템플릿의 코드 배치와 책임 경계를 설명합니다.

## 목표

- 라우팅, 서버 상태, 클라이언트 UI 상태, 폼 검증, mock API, 테스트 흐름을 한 프로젝트 안에서 확인한다.
- 기능 단위 코드와 공통 코드를 분리해 작은 실무형 React 앱의 기본 구조를 보여준다.
- 새 기능을 추가할 때 어느 폴더에 무엇을 넣을지 예측 가능하게 만든다.

## 상위 구조

```txt
src/app        앱 부트스트랩, provider, router, 전역 스타일
src/routes     TanStack Router file route 정의
src/layouts    Dashboard/Auth 레이아웃과 헤더 UI
src/features   도메인 기능 단위 코드
src/pages      독립 페이지 예제
src/shared     도메인 독립 UI 컴포넌트와 유틸
src/stores     Zustand 상태 (UI / 인증 / 알림)
src/mocks      MSW handler, browser/server setup, fixture
src/test       Vitest setup
```

## 레이어 책임

### `src/app`

- `main.tsx`는 React root를 만들고 환경변수(`VITE_ENABLE_MOCKS`)에 따라 MSW worker를 시작한다.
- `App.tsx`는 provider와 router를 연결한다.
- `router.tsx`는 TanStack Router 인스턴스를 생성하고 `context`로 auth store를 주입한다.
- `router-context.ts`는 라우터 context 타입(`{ auth }`)을 정의해 `beforeLoad`에서 인증 상태를 읽게 한다.
- `providers/QueryProvider.tsx`는 앱 전체 React Query client를 제공한다.
- `providers/AppProviders.tsx`는 theme/density를 document 속성에 동기화하고 전역 `Toaster`를 마운트한다.

### `src/routes`

- TanStack Router의 file route만 둔다.
- route 파일은 URL과 page component를 연결하는 얇은 계층으로 유지한다.
- 실제 화면 구현은 `features` 또는 `pages`에 둔다.
- `_dashboard.tsx`는 `beforeLoad`로 미인증 접근을 막고 `/signin`으로 리다이렉트하는 보호 라우트다.
- `signin.tsx`는 `validateSearch`로 `redirect` 검색 파라미터를 파싱한다.
- 라우트 컴포넌트는 Vite 플러그인의 `autoCodeSplitting`으로 라우트별 청크로 분리된다.

### `src/layouts`

- `DashboardLayout`은 사이드바, 상단 헤더, theme toggle, 로그아웃 버튼, main outlet을 담당한다.
- `ThemeToggle`은 Zustand `theme` 상태를 사용하는 우측 상단 day/night 토글 예제다.
- `AuthLayout`은 dashboard shell이 필요 없는 로그인 화면의 중앙 정렬 레이아웃이다.

### `src/features`

기능 단위 코드를 모으는 영역입니다.

```txt
features/projects/api       fetch wrapper
features/projects/queries   TanStack Query key/options/hooks
features/projects/model     type, schema, pure utility
features/projects/hooks     feature 전용 hook
features/projects/components feature 전용 UI
features/projects/pages     route가 렌더링하는 page component
features/auth/api           로그인 요청 wrapper (signInRequest)
```

`dashboard`, `projects`, `settings`, `auth`는 서로 다른 기능 경계를 보여주는 예제입니다.

### `src/shared`

- feature에 종속되지 않는 UI primitive와 유틸을 둔다.
- `shared/ui`는 Button, Card, Dialog, Input, Select, `Toaster` 같은 재사용 컴포넌트다.
- `shared/lib`는 `cn`, `formatDate`, test helper처럼 도메인과 무관한 함수를 둔다.
- `shared/config/env.ts`는 `import.meta.env`를 Zod로 검증한 타입 안전 환경변수를 제공한다.

### `src/stores`

- Zustand 기반 client 상태를 둔다.
- `ui-store`는 `sidebarOpen`, `theme`, `density`를 관리한다. `theme`/`density`는 localStorage key `react-sample-ui`에 저장하고, `sidebarOpen`은 일시적 shell 상태라 저장 대상에서 제외한다.
- `auth-store`는 `token`, `user`, `isAuthenticated`를 관리하며 localStorage key `react-sample-auth`에 저장한다. 라우터 context로 주입되어 `beforeLoad` 가드가 이 상태를 읽는다.
- `toast-store`는 전역 알림 목록과 `toast.success/error/info` 헬퍼를 제공한다(영속화하지 않음).
- 서버에서 가져오는 프로젝트 데이터는 이곳에 두지 않고 TanStack Query에 맡긴다.

### `src/mocks`

- MSW handler와 fixture를 둔다.
- 개발 환경에서는 browser worker가 `/api/projects`, `/api/login` 등 요청을 가로챈다.
- 테스트 환경에서는 server setup이 같은 handler를 사용한다.

## 데이터 흐름

```txt
route file
  -> page component
  -> query hook / mutation hook
  -> API function
  -> fetch("/api/...")
  -> MSW handler
  -> fixture data
```

클라이언트 UI 상태는 별도 흐름을 사용합니다.

```txt
layout/settings component
  -> useUiStore selector
  -> Zustand store
  -> component re-render
```

## 인증 흐름

미인증 사용자가 보호 라우트에 접근하면 `beforeLoad`가 로그인으로 리다이렉트하고, 로그인 후 원래 목적지로 복귀합니다.

```txt
보호 라우트 접근 (예: /settings)
  -> _dashboard beforeLoad
  -> context.auth.getState().isAuthenticated == false
  -> redirect("/signin?redirect=/settings")
  -> SignInPage 제출
  -> signInRequest() -> MSW POST /api/login -> token 발급
  -> authStore.signIn({ token, user })  (localStorage 저장)
  -> navigate({ to: search.redirect ?? "/" })
  -> 이제 beforeLoad 통과 -> 원래 목적지 렌더
```

로그아웃은 `authStore.signOut()`으로 상태를 비우고 `/signin`으로 이동합니다.

## 알림(Toast) 흐름

```txt
mutation onSuccess / onError 등 어디서든
  -> toast.success("...")
  -> toastStore.add(...)
  -> AppProviders에 마운트된 Toaster가 렌더
  -> 각 ToastItem이 4초 후 자동 dismiss
```

## 상태 관리 기준

- 서버 데이터: TanStack Query
- 클라이언트 UI 상태 / 인증 / 알림: Zustand (`ui-store`, `auth-store`, `toast-store`)
- 폼 상태: React Hook Form
- 입력 검증: Zod
- API mocking: MSW

## 새 기능 추가 기준

- 새 URL이 필요하면 `src/routes`에 route 파일을 추가한다.
- 특정 도메인 기능이면 `src/features/<feature-name>` 아래에 page, component, query, model을 둔다.
- 여러 기능에서 재사용되면 `src/shared`로 이동한다.
- 서버 데이터 cache나 mutation은 TanStack Query를 우선 사용한다.
- 단순 UI preference나 shell 상태는 Zustand store에 둔다.
