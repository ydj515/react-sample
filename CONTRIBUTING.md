# 기여 가이드

이 저장소는 실무형 React 템플릿 예제입니다. 아래 절차를 따라 기여해 주세요.

## 사전 준비

- Node.js 24.13.0 (`.nvmrc` 기준), pnpm 11.7.0
- `mise`를 사용하면 도구 버전을 자동으로 맞출 수 있습니다.

```bash
mise install
corepack enable
pnpm install
```

`pnpm install` 시 lefthook git hook이 자동으로 설치됩니다(pre-commit: format/lint, pre-push: typecheck).

## 개발 워크플로

```bash
mise run dev          # 개발 서버 (Vite + MSW)
mise run storybook    # Storybook (컴포넌트 카탈로그)
mise run test         # 단위 테스트 (Vitest)
mise run test-e2e     # E2E 테스트 (Playwright)
```

## 커밋 전 확인

PR을 올리기 전 로컬 품질 게이트를 통과시켜 주세요.

```bash
pnpm validate         # typecheck + lint + format:check + coverage + build
pnpm verify           # validate + Storybook build + Playwright E2E
```

일반 코드 변경은 `pnpm validate`를 기준으로 합니다. route, 브라우저 동작,
Storybook 또는 전체 템플릿 흐름에 영향을 주는 변경은 handoff 전에
`pnpm verify`까지 실행해 주세요.

## 커밋 메시지

Conventional Commits 형식을 권장합니다.

- `feat:` 기능 추가
- `fix:` 버그 수정
- `refactor:` 동작 변경 없는 리팩터링
- `docs:` 문서
- `test:` 테스트
- `chore:` / `ci:` 빌드·설정·CI

## UI 변경

`src/shared/ui`의 컴포넌트를 추가/변경하면 대응하는 Storybook 스토리(`*.stories.tsx`)도 함께 갱신해 주세요.

## 기능 추가

파일 배치, 상태 선택, API 오류 계약, 테스트 범위는
[새 기능 추가 체크리스트](docs/feature-addition-checklist.md)를 확인해 주세요.

`src/routeTree.gen.ts`, `public/mockServiceWorker.js`와 `dist/`, `coverage/`,
`storybook-static/`, `playwright-report/`, `test-results/` 같은 생성물은 직접
수정하지 않습니다.
