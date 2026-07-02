# pnpm commands

## Package

```bash
pnpm add # 패키지를 설치한다
pnpm add -D # devDependencies에 추가한다
pnpm install # 프로젝트의 모든 dependency를 설치한다
pnpm remove # 패키지를 제거한다
pnpm prune # 사용되지 않는 패키지를 의존성에서 제거한다
```

## Project Scripts

```bash
pnpm dev # route tree를 생성한 뒤 Vite dev server를 실행한다
pnpm generate-routes # TanStack Router route tree를 생성한다
pnpm typecheck # TypeScript project reference를 검사한다
pnpm lint # ESLint를 실행한다
pnpm format # Prettier로 전체 파일을 정리한다
pnpm format:check # Prettier 포맷을 검사한다
pnpm test # Vitest 테스트를 실행한다
pnpm build # route tree, typecheck, Vite production build를 실행한다
pnpm validate # typecheck, lint, format, test, build를 순서대로 검증한다
```
