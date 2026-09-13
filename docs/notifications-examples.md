# 알림 센터 예제

`/notifications` 라우트와 GNB 종 아이콘으로 주문·프로젝트·사용자·상품·시스템
알림을 통합 관리하는 예제다. TanStack Query의 `useInfiniteQuery`로 무한 스크롤
목록을, `refetchInterval`로 안 읽은 알림 수를 폴링하고, 새로 도착한 알림은
토스트로 알려준다. React 19의 `useTransition`으로 낙관적 읽음 토글을 다룬다.

| 경로             | 화면          | 주요 기능                                                                 |
| ---------------- | ------------- | ------------------------------------------------------------------------- |
| `/notifications` | 알림 센터     | 무한 스크롤, 카테고리·읽음 필터, 개별 읽음, 모두 읽음, 마지막 동기화 시각 |
| GNB 종 아이콘    | 알림 드롭다운 | 미확인 배지, 목록 + 무한 스크롤, 개별 읽음, 모두 읽음, 풀 페이지 링크     |

## 데이터와 갱신 흐름

- 기준 데이터는 `GET /api/notifications` 페이지 응답(`NotificationPage`)이다.
  `cursor` 쿼리 파라미터와 `limit`(기본 8)로 잘라 내려준다.
- 미확인 카운트는 `GET /api/notifications/unread-count`로 5초마다 폴링한다.
  `refetchIntervalInBackground: false`로 백그라운드 탭에서는 멈춘다.
- 개별 읽음은 `POST /api/notifications/:id/read`로 즉시 서버에 반영하고,
  `useMarkNotificationReadMutation`은 카운트 캐시를 1 감소시킨 뒤 모든
  알림 관련 쿼리를 무효화한다. 화면에는 React 19 `useTransition`으로
  처리 중 상태를 표시한다.
- 모두 읽음은 `POST /api/notifications/read-all`로 카운트를 0으로 만들고 모든
  알림 쿼리를 무효화한다.
- 새 알림 도착은 `useNotificationStream` 훅이 카운트 증가를 감지하면
  `toast.info`로 안내한다. 같은 알림에 대한 중복 토스트를 막기 위해
  `count:latestId` 키를 짧은 시간 동안 기억한다.

## 낙관적 표시와 실패 처리

알림 자체는 작은 메타데이터이므로 별도의 optimistic 업데이트를 추가하지 않는다.
대신 `useTransition`으로 클릭과 동시에 시각적 "처리 중…" 라벨을 표시하고,
서버 실패 시 React가 이전 캐시 값으로 자연스럽게 복구하도록 한다. 무한 스크롤의
각 페이지가 동일한 `queryKey`를 공유하기 때문에 mutation 성공 후 한 번의
`invalidateQueries`로 모든 페이지가 다시 그려진다.

## 필터와 URL 상태

`/notifications`는 카테고리(`all | order | project | user | product | system`)
와 읽음 상태(`all | unread`)를 `validateSearch`로 검증해 URL에 저장한다.
loader는 `loaderDeps`로 두 값을 정규화한 뒤 같은 키로
`ensureInfiniteQueryData`를 호출해 첫 진입 시 첫 페이지가 함께 캐시에 들어간다.
TanStack Router의 `navigate({ search: ... })`는 자동 정규화를 거치지 않으므로
페이지에서 `notificationListSearchSchema.parse`로 항상 검증한 객체를 전달한다.

## 컴포넌트 구조

- `NotificationCenter` (GNB 통합): 종 아이콘과 드롭다운의 토글 상태를 관리하고
  `useNotificationStream`으로 폴링과 토스트를 활성화한다.
- `NotificationBell`: 미확인 배지, `aria-haspopup="dialog"`, `aria-expanded`로
  드롭다운 상태를 노출한다. 99건 이상은 `99+`로 압축한다.
- `NotificationDropdown`: Radix `Dialog` 기반의 모바일 친화적 패널이다.
  상단에 카운트 요약과 "모두 읽음" 액션, 본문에 IntersectionObserver로
  다음 페이지를 불러오는 무한 스크롤, 하단에 `/notifications` 링크를 둔다.
- `NotificationItem`: 카테고리·심각도별 아이콘, `Intl.RelativeTimeFormat` 기반
  시각, 발신자·연결 링크·개별 읽음 버튼. `data-testid`로 테스트가 안정적이다.
- `NotificationFilters`: 카테고리·읽음 상태 셀렉트와 초기화 버튼. 변경 시
  URL `search`로 전달된다.
- `NotificationsPage`: 필터 + KPI 카드 + 무한 스크롤 + 모두 읽음 액션.
  `PageMetadata`로 문서 제목과 설명을 선언한다.

## 읽음 상태와 행 크기

같은 알림은 읽음 처리 전후에 높이와 줄바꿈을 유지한다. 미확인 점의 자리를
유지하고, 개별 읽음 버튼은 같은 크기의 영역 안에서 `읽음` 텍스트로 바뀐다.
작성자와 연결 링크가 없는 알림도 읽음 버튼을 제공한다. 내용 길이에 따른
자연스러운 높이 차이는 허용하며, 목록과 모바일 알림 패널에서 검증한다.

## 접근성과 모션

- 종 아이콘의 `aria-label`은 미확인 카운트를 한국어 숫자로 표현한다.
- 미확인 알림 행에는 `data-unread` 속성과 시각적 점(`bg-brand`)이 함께 표시된다.
- 드롭다운은 Radix Dialog의 `onCloseAutoFocus`로 토글 버튼에 포커스를 돌려보낸다.
- `aria-busy`, `aria-haspopup`, `aria-expanded`로 토글과 로딩 상태를 노출한다.
- IntersectionObserver가 다음 페이지 호출을 시작하면 마지막 행에 진행 표시
  ("추가 알림을 불러오는 중")가 나타난다.

## Mock API와 검증

- `src/mocks/data/notifications.ts`의 fixture는 카테고리별·읽음 상태별로 골고루
  15개의 알림을 제공한다. `resetNotificationsMockData`가 id 기준으로
  `read` 상태를 복구한다.
- 핸들러는 `src/mocks/notification-handlers.ts`에서 페이지·단건 읽음·모두 읽음을
  담당한다. 잘못된 ID는 `NOTIFICATION_NOT_FOUND` 404로 응답한다.
- API 통합 테스트는 실제 `fetch`와 MSW를 통해 다음을 검증한다.
  - 페이지·카테고리·읽음 필터의 결과 정확성
  - 단건/모두 읽음 후 카운트 갱신
  - 알 수 없는 ID는 404
  - 응답 스키마 위반은 `INVALID_RESPONSE`로 변환
- 통합 페이지는 TanStack Router 메모리 라우터와 MSW로 다음을 검증한다.
  - 필터 변경 → URL 갱신 → 결과 재조회
  - 모두 읽음 처리 후 안 읽음 필터에서 빈 상태
  - 개별 읽음 버튼 클릭 시 카운트 감소
- Vitest 환경의 jsdom은 `IntersectionObserver`를 제공하지 않으므로
  `src/test/setup.ts`에서 안전한 noop 스텁을 등록한다. 실제 스크롤과 무한
  스크롤 UX는 Playwright로 확인한다.

## 검증 명령

```bash
pnpm exec vitest run src/features/notifications      # API + 페이지 통합
pnpm exec tsc -b --pretty false                     # 타입 검사
pnpm exec eslint src/features/notifications src/layouts src/mocks
pnpm exec prettier --check src/features/notifications src/layouts src/mocks
pnpm exec storybook build                            # Bell/Item 스토리 포함
```

전체 `pnpm validate`와 `pnpm verify`를 통해 회귀가 없는지 확인한다.
