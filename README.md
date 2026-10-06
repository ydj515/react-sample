# React Sample

관리자 대시보드와 쇼핑 화면으로 React 애플리케이션의 구성 방법을 보여주는 프런트엔드 샘플입니다.
라우팅·인증 흐름부터 데이터 조회·수정, 폼, 공통 UI, 테스트까지 기능 단위로 구성했습니다.
개발 모드에서는 MSW mock API로 실행하므로 백엔드 없이 둘러볼 수 있습니다.

**기술 스택:** React 19 · TypeScript · Vite · Tailwind CSS · TanStack Router/Query · Zustand

## 이 샘플에서 볼 수 있는 것

- **화면 예제:** 대시보드, 프로젝트·사용자·상품·주문 관리, 쇼핑·장바구니, 문서와 랜딩 페이지, 블로그/CMS·CRM·파일 관리자
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

## mise 환경과 초기 설정

`mise.toml`은 도구·공통 task, `mise.dev.toml`/`mise.prod.toml`은 공유 환경 선택을 담당한다.

```bash
mise trust ./mise.toml   # task와 overlay를 검토한 뒤 신뢰
mise run bootstrap     # 고정된 버전의 도구 설치 후 의존성 준비
mise run config:check  # task 참조·순환 검사, 앱 실행 없음
mise run verify        # 프로젝트 검증 (Docker 등 기존 검증 전제는 유지)
mise -E dev run verify
```

- 기본 실행은 `APP_ENV=local`, `-E dev`는 개발 overlay, `-E prod`는 운영 설정 선택이다. 환경 선택 자체가 배포나 서비스 시작을 수행하지 않는다.
- 개인 개발 설정은 `mise.dev.local.toml.example`을 검토해 `mise.dev.local.toml`로 복사한다. `.env.dev.local`을 만든 뒤 `env._.file`을 활성화하면 dev에서만 읽는다. 기존 개인 파일을 덮어쓰지 않는다.
- `mise.local.toml`은 **모든 환경**에서 로드된다. prod checkout에 개인 override나 개발 dotenv를 두지 않는다. `-E local`은 사용하지 않는다.
- `APP_ENV`는 공통 환경 식별자다. 애플리케이션의 기존 실행·배포 설정은 유지한다.
- Vite 앱의 `build`는 기본/ prod에서 `production`, dev에서 `development` mode를 사용한다. Next.js는 자체 dev/build 모드를 유지한다. `NODE_ENV`를 전역 production으로 설정하지 않아 개발 의존성 설치가 누락되지 않는다.
- mise는 개발 도구의 정확한 버전 고정과 프로필 분리에 사용한다. `[settings] lockfile = false`로 도구 lock 생성을 끄고 `mise.lock`은 관리하지 않는다. 공통 표준의 mise lock 지침보다 이 저장소의 정책을 우선한다. 설치 파일까지 고정해야 하는 요구가 생기면 다시 도입한다.
- 도구 버전은 `mise.toml`의 `[tools]`에서 관리하며 dev/prod에서도 같은 버전을 사용한다. 로컬과 CI는 `mise install` 또는 같은 정확한 버전의 setup action으로 도구를 준비한다. `package-lock.json`, `pnpm-lock.yaml`, `uv.lock`, Gradle lock 등 애플리케이션 의존성 잠금과 검증 옵션은 유지한다.
- 지원 OS는 각 도구와 실행 스크립트의 호환성에 따른다. mise lock을 사용하지 않는다고 Windows 실행까지 보장되는 것은 아니다.
- `mise run bootstrap`은 프로젝트 초기 설정이다. OS package·dotfile·서비스를 관리하는 `mise bootstrap`은 개인 머신 설정에서 별도로 채택한다.
