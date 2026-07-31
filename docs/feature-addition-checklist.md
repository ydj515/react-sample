# 새 기능 추가 체크리스트

새 기능을 추가할 때 파일 배치와 검증 범위를 빠뜨리지 않기 위한
체크리스트입니다.

## 1. Route와 화면 배치

- [ ] 새 URL이 필요하면 `src/routes`에 얇은 route 파일을 추가했다.
- [ ] route 파일에는 URL, search/params 검증, loader 또는 page 연결만 뒀다.
- [ ] 도메인 화면은 `src/features/<feature>/pages`에 배치했다.
- [ ] 독립 화면만 `src/pages`에 배치했다.
- [ ] 보호 route 여부와 로그인 후 redirect 동작을 확인했다.

## 2. Feature 내부 책임

- [ ] HTTP 호출은 `features/<feature>/api`에 뒀다.
- [ ] 서버 응답은 Zod schema로 런타임 검증한다.
- [ ] TanStack Query key, query, mutation은 `queries`에 뒀다.
- [ ] 타입, schema, 순수 도메인 유틸은 `model`에 뒀다.
- [ ] feature 전용 UI와 hook을 feature 내부에 유지했다.
- [ ] feature `api`, `model`, `queries`가 route, layout, page, store에
      의존하지 않는다.

## 3. 상태 선택

- [ ] 서버에서 가져온 데이터는 TanStack Query로 관리한다.
- [ ] form 입력과 오류는 React Hook Form과 Zod로 관리한다.
- [ ] 전역 client UI/auth/toast 상태만 Zustand에 둔다.
- [ ] component 하나에서만 필요한 상태는 지역 state로 유지한다.
- [ ] 서버 데이터를 Zustand에 중복 저장하지 않는다.

## 4. Shared 승격 기준

- [ ] 둘 이상의 feature에서 재사용되는 도메인 독립 코드만 `shared`로
      이동했다.
- [ ] `shared`가 feature, route, page, layout, app에 의존하지 않는다.
- [ ] 공통 HTTP 처리는 `shared/api`의 `apiRequest`와 `ApiError`를 사용한다.
- [ ] shared UI 변경에 대응하는 Storybook story를 추가하거나 갱신했다.

## 5. Mock API와 오류 계약

- [ ] 새 HTTP 흐름에 MSW handler와 현실적인 fixture를 추가했다.
- [ ] 실패 응답은 `status`, `code`, `message`, `path`, `traceId`를 제공한다.
- [ ] 오류 본문과 `X-Trace-Id` 헤더가 같은 trace ID를 사용한다.
- [ ] 성공 응답 schema 위반과 HTTP 실패를 각각 테스트했다.
- [ ] 토큰, 비밀번호, 원본 오류 body를 로그나 UI에 노출하지 않는다.

## 6. 테스트

- [ ] schema와 순수 함수는 unit test로 검증했다.
- [ ] UI는 role, label, visible text 중심으로 component test를 작성했다.
- [ ] API/query 흐름은 실제 `fetch`와 MSW를 거치는 integration test로
      검증했다.
- [ ] route, 인증, 브라우저 상호작용 변경은 Playwright 시나리오를
      추가하거나 갱신했다.
- [ ] 동작 변경을 잡아내는 테스트가 구현 전에 실패하는 것을 확인했다.

## 7. 최종 확인

- [ ] `pnpm validate`가 통과한다.
- [ ] UI 또는 Storybook 변경 시 `pnpm build-storybook`이 통과한다.
- [ ] 브라우저 흐름 변경 시 `pnpm test:e2e`가 통과한다.
- [ ] 전체 handoff 전 `pnpm verify`가 통과한다.
- [ ] README, architecture, testing 문서와 실제 명령이 일치한다.
- [ ] `dist`, `coverage`, `storybook-static`, 테스트 결과 같은 생성물은
      커밋하지 않았다.
- [ ] 버전 관리되는 생성 런타임 자산은 생성 명령으로 갱신했다.
      `public/mockServiceWorker.js`는 `pnpm exec msw init public --save`로
      재생성하고 `PACKAGE_VERSION`이나 `INTEGRITY_CHECKSUM`을 직접 수정하지
      않았다.
