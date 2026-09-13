# React Sample

관리자 대시보드와 쇼핑 화면으로 React 애플리케이션의 구성 방법을 보여주는 프런트엔드 샘플입니다.
라우팅·인증 흐름부터 데이터 조회·수정, 폼, 공통 UI, 테스트까지 기능 단위로 구성했습니다.
개발 모드에서는 MSW mock API로 실행하므로 백엔드 없이 둘러볼 수 있습니다.

**기술 스택:** React 19 · TypeScript · Vite · Tailwind CSS · TanStack Router/Query · Zustand

## 이 샘플에서 볼 수 있는 것

- **화면 예제:** 대시보드, 프로젝트·사용자·상품·주문 관리, 쇼핑·장바구니, 문서와 랜딩 페이지
- **데이터와 상태:** TanStack Query의 서버 상태, Zustand의 UI 상태, React Hook Form·Zod의 폼 검증
- **개발 흐름:** 기능별 의존성 경계, 라우트별 코드 분할, Storybook과 Vitest·Playwright 테스트

## 빠른 시작

[mise](https://mise.jdx.dev/)를 준비하고 저장소 루트에서 실행합니다. Node.js와 pnpm 버전은 [`mise.toml`](./mise.toml)에 고정되어 있습니다.

```bash
mise install
mise run install
mise run dev
```

터미널에 표시된 주소(기본 `http://localhost:5173`)를 여세요.
관리자 화면은 `/signin`에서 이메일 형식과 비어 있지 않은 비밀번호를 입력하면 데모 로그인할 수 있습니다.
`/shop`, `/docs`, `/landing`은 로그인 없이 볼 수 있습니다.

실제 API 연결에는 환경변수와 인증 연동이 필요합니다. mock 모드와 배포 설정은 [개발 가이드](./docs/development-guide.md)에 설명합니다.

## 검증과 컴포넌트 탐색

```bash
mise run validate   # 타입·린트·포맷·커버리지·빌드
mise run storybook  # 컴포넌트 카탈로그 (:6006)
```

E2E를 포함한 전체 검증은 브라우저를 설치한 뒤 실행합니다.

```bash
mise exec -- pnpm exec playwright install chromium
mise run verify
```

## 더 알아보기

- [실행 설정·전체 예제 경로](./docs/development-guide.md)
- [아키텍처와 상태 관리](./docs/architecture.md)
- [기술 선택 이유](./docs/tech-stack.md)
- [테스트와 검증](./docs/testing.md)
- [전체 문서](./docs/README.md) · [기여 가이드](./CONTRIBUTING.md)
