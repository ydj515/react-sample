# Tech Stack

이 문서는 프로젝트에 포함된 주요 기술이 어떤 역할을 하는지 설명합니다.

## Runtime And Tooling

| 기술            | 역할                                   |
| --------------- | -------------------------------------- |
| Node.js 24.13.0 | 로컬 개발, 빌드, 테스트 실행 런타임    |
| pnpm            | 패키지 설치와 script 실행              |
| mise            | Node 버전과 반복 task 실행 진입점 관리 |
| Vite            | 개발 서버, HMR, production bundle 생성 |
| TypeScript      | 정적 타입 검사와 editor tooling        |

## UI

| 기술                     | 역할                                         |
| ------------------------ | -------------------------------------------- |
| React 19                 | UI component와 client rendering 기반         |
| Tailwind CSS v4          | utility-first styling과 dark variant 구성    |
| lucide-react             | 헤더, 버튼 등에 쓰는 아이콘                  |
| Radix UI Dialog          | 접근성 있는 Dialog primitive                 |
| class-variance-authority | Button, Badge 같은 variant 기반 스타일 구성  |
| clsx, tailwind-merge     | 조건부 class 조합과 Tailwind class 충돌 정리 |

## Routing

| 기술                      | 역할                                                       |
| ------------------------- | ---------------------------------------------------------- |
| TanStack Router           | file route 기반 라우팅, route params, type-safe route tree |
| `@tanstack/router-plugin` | Vite build/dev 시 route tree 생성 보조                     |
| `@tanstack/router-cli`    | `pnpm generate-routes`에서 route tree 생성                 |

라우트 파일은 `src/routes`에 있고, 생성 파일은 `src/routeTree.gen.ts`입니다.

## Data And State

| 기술           | 역할                                                                 |
| -------------- | -------------------------------------------------------------------- |
| TanStack Query | 서버 데이터 fetch, cache, loading/error state, mutation invalidation |
| Zustand        | 사이드바, 테마, 밀도 같은 client UI state                            |
| MSW            | 개발/테스트 환경에서 mock API 제공                                   |

서버 데이터와 클라이언트 UI 상태를 분리하는 것이 이 템플릿의 핵심 기준입니다.
Zustand의 `theme`과 `density` preference는 localStorage key `react-sample-ui`에 저장합니다.

## Forms And Validation

| 기술                  | 역할                                         |
| --------------------- | -------------------------------------------- |
| React Hook Form       | form field 등록, submit, field error 관리    |
| Zod                   | form input schema와 runtime validation       |
| `@hookform/resolvers` | Zod schema를 React Hook Form resolver로 연결 |

프로젝트 생성 Dialog에서 form state, validation, mutation 흐름을 확인할 수 있습니다.

## Quality Tools

| 기술            | 역할                                                              |
| --------------- | ----------------------------------------------------------------- |
| ESLint          | TypeScript, React Hooks, React Refresh, Testing Library 규칙 검사 |
| Prettier        | 코드 포맷과 Tailwind class 정렬                                   |
| Vitest          | unit/component/integration test runner                            |
| Testing Library | 사용자 관점 DOM 테스트                                            |
| jsdom           | 브라우저 DOM API를 테스트 환경에 제공                             |
| V8 coverage     | coverage report provider                                          |

## 선택 기준

- routing은 URL과 page 연결을 명확히 보여주기 위해 TanStack Router를 사용한다.
- 서버 상태는 직접 `useEffect`로 관리하지 않고 TanStack Query로 cache와 invalidation을 표현한다.
- 전역 UI preference는 Zustand로 작게 관리한다.
- API 서버가 없어도 기능 흐름을 확인할 수 있도록 MSW를 사용한다.
- form 예제는 React Hook Form과 Zod를 함께 사용해 실무에서 흔한 검증 흐름을 보여준다.
