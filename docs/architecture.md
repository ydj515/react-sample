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
src/stores     Zustand client UI state
src/mocks      MSW handler, browser/server setup, fixture
src/test       Vitest setup
```

## 레이어 책임

### `src/app`

- `main.tsx`는 React root를 만들고 개발 환경에서 MSW worker를 시작한다.
- `App.tsx`는 provider와 router를 연결한다.
- `router.tsx`는 TanStack Router 인스턴스를 생성한다.
- `providers/QueryProvider.tsx`는 앱 전체 React Query client를 제공한다.

### `src/routes`

- TanStack Router의 file route만 둔다.
- route 파일은 URL과 page component를 연결하는 얇은 계층으로 유지한다.
- 실제 화면 구현은 `features` 또는 `pages`에 둔다.

### `src/layouts`

- `DashboardLayout`은 사이드바, 상단 헤더, theme toggle, main outlet을 담당한다.
- `ThemeToggle`은 Zustand `theme` 상태를 사용하는 우측 상단 day/night 토글 예제다.
- `AuthLayout`은 인증 화면처럼 dashboard shell이 필요 없는 페이지의 중앙 정렬 레이아웃이다.

### `src/features`

기능 단위 코드를 모으는 영역입니다.

```txt
features/projects/api       fetch wrapper
features/projects/queries   TanStack Query key/options/hooks
features/projects/model     type, schema, pure utility
features/projects/hooks     feature 전용 hook
features/projects/components feature 전용 UI
features/projects/pages     route가 렌더링하는 page component
```

`dashboard`, `projects`, `settings`는 서로 다른 기능 경계를 보여주는 예제입니다.

### `src/shared`

- feature에 종속되지 않는 UI primitive와 유틸을 둔다.
- `shared/ui`는 Button, Card, Dialog, Input, Select 같은 재사용 컴포넌트다.
- `shared/lib`는 `cn`, `formatDate`, test helper처럼 도메인과 무관한 함수를 둔다.

### `src/stores`

- Zustand 기반 client UI state를 둔다.
- 현재 예제는 `sidebarOpen`, `theme`, `density`를 관리한다.
- `theme`과 `density`는 localStorage key `react-sample-ui`에 저장한다.
- `sidebarOpen`은 일시적인 shell 상태로 보고 브라우저 저장 대상에서 제외한다.
- 서버에서 가져오는 프로젝트 데이터는 이곳에 두지 않고 TanStack Query에 맡긴다.

### `src/mocks`

- MSW handler와 fixture를 둔다.
- 개발 환경에서는 browser worker가 `/api/projects` 요청을 가로챈다.
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

## 상태 관리 기준

- 서버 데이터: TanStack Query
- 클라이언트 UI 상태: Zustand
- 폼 상태: React Hook Form
- 입력 검증: Zod
- API mocking: MSW

## 새 기능 추가 기준

- 새 URL이 필요하면 `src/routes`에 route 파일을 추가한다.
- 특정 도메인 기능이면 `src/features/<feature-name>` 아래에 page, component, query, model을 둔다.
- 여러 기능에서 재사용되면 `src/shared`로 이동한다.
- 서버 데이터 cache나 mutation은 TanStack Query를 우선 사용한다.
- 단순 UI preference나 shell 상태는 Zustand store에 둔다.
