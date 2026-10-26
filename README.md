# React Sample

[![CI](https://github.com/ydj515/react-sample/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ydj515/react-sample/actions/workflows/ci.yml)
[![Deploy Storybook](https://github.com/ydj515/react-sample/actions/workflows/deploy-storybook.yml/badge.svg?branch=main)](https://github.com/ydj515/react-sample/actions/workflows/deploy-storybook.yml)
![Node.js](https://img.shields.io/badge/Node.js-24.19-339933?logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.22-F69220?logo=pnpm&logoColor=white)
![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)

관리자 대시보드와 쇼핑 화면으로 React 애플리케이션의 구성 방법을 보여주는 프런트엔드 샘플입니다.
라우팅·인증 흐름부터 데이터 조회·수정, 폼, 공통 UI, 테스트까지 기능 단위로 구성했습니다.
개발 모드에서는 MSW mock API로 실행하므로 백엔드 없이 둘러볼 수 있습니다.

**기술 스택:** React 19 · TypeScript · Vite · Tailwind CSS · TanStack Router/Query · Zustand

## 이 샘플에서 볼 수 있는 것

- **화면 예제:** 대시보드, 프로젝트·사용자·상품·주문 관리, 쇼핑·장바구니, 문서와 랜딩 페이지, 블로그/CMS·CRM·파일 관리자
- **데이터와 상태:** TanStack Query의 서버 상태, Zustand의 UI 상태, React Hook Form·Zod의 폼 검증
- **개발 흐름:** 기능별 의존성 경계, 라우트별 코드 분할, Storybook과 Vitest·Playwright 테스트

## 요구 사항

- [mise](https://mise.jdx.dev/) — Node.js와 pnpm 버전은 [`mise.toml`](./mise.toml)에 고정되어 있으며 `mise`가 설치합니다.

## 빠른 시작

```bash
mise trust          # 최초 1회, mise.toml 검토 후 신뢰
mise run bootstrap  # 고정된 Node.js·pnpm 설치 + 의존성 설치
mise run dev
```

터미널에 표시된 주소(기본 `http://localhost:5173`)를 여세요.
관리자 화면은 `/signin`에서 이메일 형식과 비어 있지 않은 비밀번호를 입력하면 데모 로그인할 수 있습니다.
`/shop`, `/docs`, `/landing`은 로그인 없이 볼 수 있습니다.

실제 API 연결에는 환경변수와 인증 연동이 필요합니다. mock 모드와 배포 설정은 [개발 가이드](./docs/development-guide.md)에 설명합니다.

## 주요 명령

| 명령                 | 설명                                         |
| -------------------- | -------------------------------------------- |
| `mise run dev`       | 라우트 생성 후 개발 서버 실행                |
| `mise run test`      | Vitest 테스트 실행                           |
| `mise run storybook` | 컴포넌트 카탈로그 (`:6006`)                  |
| `mise run validate`  | 타입·린트·포맷·커버리지·빌드 검증            |
| `mise run verify`    | `validate` + Storybook 빌드 + Playwright E2E |

E2E를 처음 실행하기 전에 브라우저를 설치합니다: `mise exec -- pnpm exec playwright install chromium`

전체 task 목록은 `mise tasks`로 확인할 수 있습니다. dev/prod 환경 프로필과 개인 설정 방법은 [개발 가이드의 mise 환경 구성](./docs/development-guide.md#mise-환경-구성)을 참고하세요.

## 문서

- [실행 설정·전체 예제 경로](./docs/development-guide.md)
- [아키텍처와 상태 관리](./docs/architecture.md)
- [기술 선택 이유](./docs/tech-stack.md)
- [테스트와 검증](./docs/testing.md)
- [전체 문서](./docs/README.md)

## 기여

변경 전 [기여 가이드](./CONTRIBUTING.md)를 확인해 주세요.
