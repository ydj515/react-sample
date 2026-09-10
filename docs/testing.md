# Testing

이 문서는 프로젝트의 테스트 구성과 검증 명령을 설명합니다.

## 테스트 도구

- Vitest: 테스트 실행기
- Testing Library: 사용자 관점 component 테스트
- user-event: 실제 사용자 입력에 가까운 이벤트 시뮬레이션
- jest-dom: DOM matcher 확장
- jsdom: 브라우저 DOM 환경
- MSW: API 요청 mocking
- Playwright: 실제 브라우저 기반 E2E
- Storybook: 재사용 UI와 상태별 렌더 카탈로그

## 테스트 계층

```txt
Unit
  schema, utility, Zustand store, test helper

Component
  shared UI, layout, page component, form dialog

Integration
  MSW 기반 API 흐름, project creation flow, 응답 schema와 오류 계약

Tooling
  생성물 ignore와 아키텍처 import 경계

E2E
  인증, dashboard, route 브라우저 흐름
```

## 주요 파일

```txt
src/test/setup.ts                              Vitest setup, MSW server lifecycle
src/shared/lib/test/render-with-providers.tsx  QueryClientProvider 포함 render helper
src/shared/lib/test/test-query-client.ts       테스트용 QueryClient factory
src/mocks/server.ts                            테스트용 MSW server
src/mocks/browser.ts                           개발 서버용 MSW worker
src/mocks/handlers.ts                          mock API handler
src/mocks/api-error.ts                         trace 가능한 mock 오류 helper
src/shared/api/http-client.test.ts             공통 API 경계 테스트
src/test/tooling-config.test.ts                lint/format/의존 경계 설정 테스트
```

## 실행 명령

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm validate
pnpm build-storybook
pnpm test:e2e
pnpm verify
```

`mise`를 사용하면 같은 흐름을 task로 실행할 수 있습니다.

```bash
mise run test
mise run coverage
mise run validate
mise run build-storybook
mise run test-e2e
mise run verify
```

## 검증 기준

`pnpm validate`는 아래 순서로 표준 품질 게이트를 실행합니다.

```txt
typecheck
lint
format:check
test:coverage
build
```

`pnpm verify`는 `validate`에 정적 Storybook build와 Playwright E2E를 더해
로컬에서 CI의 전체 범위를 재현합니다. CI는 실행 시간을 줄이기 위해 이
범위를 validate, Storybook, E2E job으로 나눠 병렬 실행합니다.

## 테스트 작성 기준

- 사용자가 보는 텍스트, role, label을 우선 쿼리한다.
- implementation detail보다 동작 결과를 검증한다.
- API 흐름은 실제 `fetch` 호출과 MSW handler를 거치게 한다.
- 성공 응답 schema 위반, 표준 HTTP 오류, trace ID 전달을 API 경계에서 검증한다.
- React Query를 사용하는 컴포넌트는 `renderWithProviders`를 사용한다.
- Zustand store 테스트는 `beforeEach`에서 상태를 초기화한다.
- shared UI 또는 재사용 visual state 변경은 Storybook story도 갱신한다.

## Mock 설정과 로그

Vitest와 Playwright가 실행하는 개발 서버는 `VITE_ENABLE_MOCKS=true`를 명시합니다.
Playwright가 기존 서버를 재사용한다면 그 서버도 mock 모드로 실행해야 합니다.
Storybook은 `viteFinal`에서 mock 모드를 명시하여 정적 production 카탈로그에서도 MSW를 사용합니다.
API 주소 테스트는 별도 서버 주소의 MSW handler로 실제 `fetch` 대상과 메서드·본문을 검증합니다.

jsdom이 구현하지 않은 `window.scrollTo`는 공통 setup에서만 stub 처리합니다.
경고를 콘솔 전체에서 숨기지 않으며 실제 스크롤 동작은 Playwright에서 검증합니다.
Storybook worker loader, Query provider 컴포넌트, decorator는 파일을 나눠 Fast Refresh 경계를 유지합니다.
