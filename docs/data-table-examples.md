# 관리자 데이터 테이블 예제

`/admin/logs` 라우트에서 `features/admin-logs` 도메인과 `shared/ui/data-table`
재사용 컴포넌트로 만든 고급 관리자 화면 예제다. 컬럼 리사이즈, 정렬, 필터,
행 가상화, 일괄 액션, CSV 내보내기를 한 컴포넌트로 조합한다.

## 화면과 사용 흐름

| 기능             | 경로          | 예제 동작                                                           |
| ---------------- | ------------- | ------------------------------------------------------------------- |
| 관리자 활동 로그 | `/admin/logs` | 420건 활동 로그, 컬럼 정렬/필터/리사이즈, 행 가상화, 일괄 액션, CSV |

좌측 사이드바의 **관리** 그룹 → **활동 로그** 또는 전역 메뉴 검색으로 진입한다.
체크박스로 행을 선택하면 상단 툴바에 일괄 액션이 나타나고, 컬럼 헤더 우측의
그립을 드래그해 폭을 조절할 수 있다.

## 공유 컴포넌트: `DataTable`

`src/shared/ui/data-table/data-table.tsx`는 도메인 독립 재사용 컴포넌트다.
권한 화면, 사용자 화면, 상품 화면처럼 다양한 관리자가 같은 데이터 테이블을
필요로 할 때 이 컴포넌트를 사용한다.

### Props

```ts
type DataTableProps<T> = {
  data: readonly T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  label: string;
  rowHeight?: number; // 기본 44px
  height?: number; // 가상화 영역 높이, 기본 480px
  emptyMessage?: string;
  isLoading?: boolean;
  enableResize?: boolean; // 기본 true
  enableSort?: boolean; // 기본 true
  enableFilter?: boolean; // 기본 true
  enableVirtualization?: boolean; // 기본 true
  enableSelection?: boolean; // 기본 false
  enableCsvExport?: boolean; // 기본 false
  csvFilename?: string;
  csvAccessor?: (row: T) => Record<string, CsvCell>;
  bulkActions?: DataTableBulkAction[];
  toolbarExtras?: ReactNode;
  className?: string;
};

type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor: (row: T) => CsvCell;
  sortable?: boolean; // 기본 true
  filterable?: boolean; // 기본 true
  defaultWidth?: number;
  minWidth?: number;
  align?: "left" | "right" | "center";
};

type DataTableBulkAction = {
  id: string;
  label: string;
  onSelect?: (selectedIds: string[]) => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
};
```

### 활성화된 기능

- **컬럼 리사이즈**: 헤더 우측의 6px 그립을 드래그. 포인터 캡처와
  `pointermove`/`pointerup`/`pointercancel`로 mousemove 없이 처리한다.
  폭은 컴포넌트 내부 상태이며 `minWidth` 미만이 되지 않는다.
- **정렬**: 헤더 클릭 시 `asc → desc → 해제` 순으로 토글된다. `shift` 클릭으로
  멀티 컬럼 정렬을 누적한다. `aria-sort` 속성이 `ascending`/`descending`으로
  갱신되어 보조기술에 노출된다.
- **필터**: 컬럼별 텍스트 입력으로 부분 일치(대소문자 무시) 필터링한다.
  입력값은 컴포넌트 내부 상태이며 X 버튼으로 즉시 해제할 수 있다.
- **행 가상화**: `@tanstack/react-virtual`로 행 단위 windowing을 한다.
  4,000건 수준의 데이터에서도 일정한 스크롤 성능을 유지한다. 비활성화하면
  일반 테이블처럼 전체 행을 그대로 렌더한다.
- **일괄 액션**: `enableSelection`이 true일 때 헤더와 각 행에 체크박스가
  나타난다. 선택된 행이 1개 이상이면 툴바에 `bulkActions` 버튼이 노출된다.
- **CSV 내보내기**: `enableCsvExport`가 true면 툴바에 CSV 버튼이 나타난다.
  `csvAccessor`가 없으면 컬럼 `accessor` 결과를 그대로 사용한다.
  한글 호환을 위해 BOM을 붙이고 `,`, `"`, 줄바꿈을 이스케이프한다.

### 상태와 라이프사이클

- 정렬·필터·리사이즈·선택 모두 컴포넌트 내부 상태다. 부모에서 제어하려면
  `useState`로 외부 상태를 두고 `defaultSorts`/`defaultFilters`/`defaultResizes`
  형태의 prop을 추가할 수 있다. 현재는 비제어 컴포넌트로 충분하다.
- `data` prop이 바뀌면 정렬·필터·선택이 그대로 유지된 채 본문만 다시 계산된다.
- 가상화 컨테이너의 `aria-busy`는 `isLoading` 동안 true가 되어 보조기술에
  진행 상태를 알린다.

### 접근성

- 표 영역은 `role="region"`과 `aria-label`로 스크롤 가능 영역임을 알린다.
- 컬럼 헤더는 `<button>` 기반 정렬 토글과 `<input type="search">` 필터를
  가지고 키보드만으로 조작할 수 있다.
- 헤더의 `aria-sort`는 정렬 상태를, `aria-label`은 각 컬럼의 의미를
  함께 제공한다.
- 체크박스는 시각적으로 숨겨진 `<input>`과 디자인된 박스로 함께 렌더되어
  키보드 포커스와 스크린 리더 접근성을 유지한다.

### 사용 예시

```tsx
import { DataTable, type DataTableColumn } from "@/shared/ui/data-table";

type Row = { id: string; name: string; amount: number; note: string | null };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "이름", accessor: (r) => r.name, defaultWidth: 140 },
  {
    id: "amount",
    header: "금액",
    accessor: (r) => r.amount,
    align: "right",
    defaultWidth: 110,
  },
  { id: "note", header: "메모", accessor: (r) => r.note, defaultWidth: 220 },
];

export function SampleTable({ rows }: { rows: Row[] }) {
  return (
    <DataTable<Row>
      label="샘플"
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      enableSelection
      enableCsvExport
      csvFilename="sample.csv"
      bulkActions={[
        {
          id: "archive",
          label: "선택 항목 보관",
          variant: "secondary",
          onSelect: (ids) => console.log(`보관: ${ids.length}건`),
        },
      ]}
    />
  );
}
```

## 활동 로그 도메인

`features/admin-logs`는 420건의 활동 로그 fixture로 위 컴포넌트를 실제로
운용하는 예제다.

- `model/admin-log-schema.ts`: `AdminLog` zod 스키마, 채널·심각도 enum,
  검색 schema(`adminLogsQuerySchema`).
- `model/admin-log-utils.ts`: 채널별/심각도별 카운트, 응답 검증.
- `api/admin-log-api.ts`: `GET /api/admin/logs` 호출 wrapper.
- `queries/admin-log-queries.ts`: TanStack Query key + options.
- `pages/AdminLogsPage.tsx`: QueryBoundary와 DataTable을 결합한 페이지.
- `pages/admin-logs/index.ts`: 라우트 지연 로딩을 위한 페이지 진입점.
- `mocks/data/admin-logs.ts`: 420건 fixture와 표시용 `formatLogDateTime`.

`AdminLogsPage`는 페이지 상단에 채널별 카드와 심각도 분포 배지를 두고,
`FilterBar`로 채널·심각도 URL search를 관리한다. URL search는
`validateSearch`에서 `adminLogsQuerySchema`로 정규화되며 `Zod catch`로
알 수 없는 값은 기본값으로 보정된다.

## Mock API와 검증

- `src/mocks/data/admin-logs.ts`의 fixture는 인증/주문/상품/사용자/시스템
  5개 채널에 걸쳐 균등 분배된 420개의 로그다. 발생 시각은 1초 간격으로
  증가하며 심각도와 채널은 결정론적으로 섞인다.
- `src/mocks/admin-logs-handlers.ts`는 `/api/admin/logs` 한 개 endpoint만
  노출한다. 응답은 zod array schema로 런타임 검증한다.
- API 통합 테스트(`admin-log-api.integration.test.ts`)는 실제 `fetch`를
  통해 MSW에 도달하고, 잘못된 응답 schema는 `INVALID_RESPONSE`로 거절됨을
  검증한다.
- 페이지 통합 테스트(`AdminLogsPage.integration.test.tsx`)는 메모리 라우터와
  MSW로 페이지가 렌더되고 채널·심각도 select로 결과가 좁혀지는 것을 검증한다.
- `shared/ui/data-table/data-table.test.ts`는 CSV 인코딩, 정렬, 필터,
  컬럼 폭 계산을 단위 테스트로 다룬다.
- 스토리북은 `Default`, `Virtualized`, `BulkActions`, `CustomCell`,
  `Loading`, `Empty`, `NarrowViewport`, `WithCallbacks`,
  `WithCustomCsvAccessor`, `BadgeExample`로 분리되어 있어 각 옵션 조합을
  시각적으로 확인할 수 있다.

## 디자인 토큰과 의존성

- 컴포넌트 스타일은 `data-table.css`에 정의되어 있으며 토큰(`--ui-*`,
  `--radius-*`)과 디자인 시스템 색상만 사용한다. 다크 모드/컴팩트 밀도 모두
  토큰을 따라 자동으로 반응한다.
- 정렬/필터/리사이즈 로직은 `data-table-utils.ts`에 순수 함수로 분리되어
  있어 다른 컴포넌트에서도 재사용할 수 있다.
- 가상화는 `@tanstack/react-virtual` 3.x의 `useVirtualizer`를 사용한다.
  `overscan` 기본값은 8이며 `rowHeight`가 정확하지 않은 경우에도 자동 보정한다.

## 검증 명령

```bash
pnpm exec vitest run src/features/admin-logs src/shared/ui/data-table
pnpm exec tsc -b --pretty false
pnpm exec eslint src/features/admin-logs src/shared/ui/data-table src/mocks/data/admin-logs.ts src/mocks/admin-logs-handlers.ts src/routes/_dashboard/admin.logs.tsx src/layouts/navigation.ts
pnpm exec prettier --check src/features/admin-logs src/shared/ui/data-table src/mocks/data/admin-logs.ts src/mocks/admin-logs-handlers.ts src/routes/_dashboard/admin.logs.tsx src/layouts/navigation.ts
pnpm exec storybook build
```

전체 `pnpm validate`와 `pnpm verify`로 회귀를 확인한다.
