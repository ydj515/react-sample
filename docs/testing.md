# Testing

이 문서는 프로젝트의 테스트 구성과 검증 명령을 설명합니다.

## 테스트 도구

- Vitest: 테스트 실행기
- Testing Library: 사용자 관점 component 테스트
- user-event: 실제 사용자 입력에 가까운 이벤트 시뮬레이션
- jest-dom: DOM matcher 확장
- jsdom: 브라우저 DOM 환경
- MSW: API 요청 mocking

## 테스트 계층

```txt
Unit
  schema, utility, Zustand store, test helper

Component
  shared UI, layout, page component, form dialog

Integration
  MSW 기반 API 흐름, project creation flow
```

## 주요 파일

```txt
src/test/setup.ts                              Vitest setup, MSW server lifecycle
src/shared/lib/test/render-with-providers.tsx  QueryClientProvider 포함 render helper
src/shared/lib/test/test-query-client.ts       테스트용 QueryClient factory
src/mocks/server.ts                            테스트용 MSW server
src/mocks/browser.ts                           개발 서버용 MSW worker
src/mocks/handlers.ts                          mock API handler
```

## 실행 명령

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm validate
```

`mise`를 사용하면 같은 흐름을 task로 실행할 수 있습니다.

```bash
mise run test
mise run coverage
mise run validate
```

## 검증 기준

`pnpm validate`는 아래 순서로 전체 품질 게이트를 실행합니다.

```txt
typecheck
lint
format:check
test
build
```

## 테스트 작성 기준

- 사용자가 보는 텍스트, role, label을 우선 쿼리한다.
- implementation detail보다 동작 결과를 검증한다.
- API 흐름은 실제 `fetch` 호출과 MSW handler를 거치게 한다.
- React Query를 사용하는 컴포넌트는 `renderWithProviders`를 사용한다.
- Zustand store 테스트는 `beforeEach`에서 상태를 초기화한다.
