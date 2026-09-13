# 개발 및 실행 가이드

[README](../README.md)의 빠른 시작 이후 환경 설정과 예제 경로를 확인하는 문서입니다.

## 초기 설정

```bash
mise install
corepack enable
pnpm install          # lefthook git hook이 자동 설치됩니다
pnpm exec playwright install chromium # E2E 브라우저 최초 1회 설치
cp .env.example .env.local   # 환경변수(선택)
```

환경변수는 `src/shared/config/env.ts`에서 Zod로 검증합니다.

## 명령

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:coverage    # coverage 임계값 포함
pnpm test:e2e         # Playwright E2E
pnpm storybook        # 컴포넌트 카탈로그 (:6006)
pnpm build-storybook
pnpm build
pnpm validate         # typecheck + lint + format:check + coverage + build
pnpm verify           # validate + Storybook build + E2E
```

## 실행 예제

Vite 개발 서버의 기본 포트는 `5173`입니다. 사용 중이면 다음 포트로 이동하므로
터미널에 표시된 주소를 확인하세요.

관리자 경로는 미인증 상태로 접근하면 `/signin`으로 이동합니다. 개발 mock 모드에서는
로그인 폼의 이메일·비밀번호 검증을 통과하면 데모 토큰을 발급합니다.

```txt
http://localhost:5173/signin                         로그인: RHF + Zod + React 19 Action
http://localhost:5173/                               종합 대시보드: 매출·주문·고객 지표
http://localhost:5173/operations                     프로젝트 운영 대시보드
http://localhost:5173/reports                        분석 리포트
http://localhost:5173/projects                       프로젝트 검색·정렬·생성
http://localhost:5173/projects/project-design-system 프로젝트 상세·낙관적 상태 변경
http://localhost:5173/users                          사용자 목록·프로필·접근 권한
http://localhost:5173/products                       상품 관리·이미지·재고
http://localhost:5173/orders                         주문 관리·상태·배송·메모
http://localhost:5173/react-19                       use(Promise)·Context·ref cleanup 예제
http://localhost:5173/docs/getting-started            문서 검색·목차·읽기 진행률
http://localhost:5173/shop                           쇼핑·찜·장바구니·모의 주문
http://localhost:5173/landing                        다양한 랜딩 페이지 카탈로그
```

### API 서버와 mock 모드

- `VITE_ENABLE_MOCKS` 미설정: 개발 서버는 `true`, production build는 `false`입니다.
- Mock 모드: 모든 도메인이 같은 출처의 `/api/...` MSW handler를 사용합니다.
- 실제 API 모드: `apiRequest`가 `VITE_API_BASE_URL` 뒤에 `/api/...` 경로를 붙입니다.
  기본값은 `http://localhost:3000`이고, 끝의 `/`와 base path를 지원합니다.
  직접 전달한 절대 URL·URL 객체·Request는 원래 주소를 유지합니다.
- `.env.local`도 production build에 반영됩니다. 실제 배포에서는 mock을 끄고 API 서버 주소를
  지정하세요. 환경변수는 빌드 시 반영되므로 변경 후 다시 빌드해야 합니다.
- API 서버는 앱 출처에 대한 CORS를 허용해야 합니다. 이 샘플에는 실제 백엔드가 포함되지 않으며,
  쿠키 인증·Bearer 토큰 주입은 사용할 백엔드 계약에 맞춰 별도 연결해야 합니다.

```bash
# 실제 API 연결
VITE_ENABLE_MOCKS=false VITE_API_BASE_URL=http://localhost:3000 pnpm dev
# 실제 배포용 빌드
VITE_ENABLE_MOCKS=false VITE_API_BASE_URL=https://api.example.com pnpm build
# API 서버 없이 샘플을 배포할 때만 mock을 명시적으로 활성화
VITE_ENABLE_MOCKS=true pnpm build
```

환경변수의 적용 시점과 우선순위는 [Vite 환경변수 문서](https://vite.dev/guide/env-and-mode)를 참고하세요.

## 전체 경로

| 경로                                                | 예제                       | 접근 |
| --------------------------------------------------- | -------------------------- | ---- |
| `/`                                                 | 종합 대시보드              | 보호 |
| `/operations`, `/reports`                           | 프로젝트 운영·분석 리포트  | 보호 |
| `/projects`, `/projects/$projectId`                 | 프로젝트 목록·상세         | 보호 |
| `/users`, `/users/$userId`                          | 사용자 목록·상세           | 보호 |
| `/products`, `/products/new`                        | 상품 목록·등록             | 보호 |
| `/products/$productId`, `/products/$productId/edit` | 상품 상세·수정             | 보호 |
| `/orders`, `/orders/$orderId`                       | 주문 목록·상세             | 보호 |
| `/settings`, `/react-19`                            | UI 설정·React 19 예제      | 보호 |
| `/signin`                                           | 데모 로그인                | 공개 |
| `/docs`, `/docs/$slug`                              | 시작 문서로 이동·문서 상세 | 공개 |
| `/shop`, `/shop/$productId`                         | 상품 탐색·상세             | 공개 |
| `/shop/cart`, `/shop/checkout`                      | 장바구니·모의 주문         | 공개 |
| `/landing`                                          | 랜딩 카탈로그              | 공개 |
| `/landing/saas`, `/landing/agency`                  | SaaS·에이전시              | 공개 |
| `/landing/course`, `/landing/event`                 | 온라인 강의·행사           | 공개 |
| `/landing/stay`, `/landing/product`                 | 숙박·제품 소개             | 공개 |

구조와 상태 관리 기준은 [아키텍처](./architecture.md), 검증 범위는 [테스트 가이드](./testing.md)를 참고합니다.
