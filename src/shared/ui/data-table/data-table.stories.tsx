import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import { fn } from "storybook/test";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { toast } from "@/stores/toast-store";
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
} from "@/shared/ui/data-table";

type Row = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "관리자" | "매니저" | "조회 전용";
  status: "활성" | "초대" | "중지";
  lastSeen: string;
  points: number;
};

const departments = ["운영팀", "마케팅팀", "고객지원팀", "개발팀", "디자인팀"];

const roles: Row["role"][] = ["관리자", "매니저", "조회 전용"];

const statuses: Row["status"][] = ["활성", "초대", "중지"];

function generateRows(count: number): Row[] {
  const seedNames = [
    "김민준",
    "이서연",
    "박도윤",
    "정지우",
    "최유진",
    "강하준",
    "윤서아",
    "임지호",
    "오예준",
    "한수아",
    "서지유",
    "문채원",
  ];

  const rows: Row[] = [];
  for (let i = 0; i < count; i += 1) {
    const name = seedNames[i % seedNames.length] ?? "사용자";

    const department = departments[i % departments.length] ?? "운영팀";

    const role = roles[i % roles.length] ?? "조회 전용";

    const status = statuses[i % statuses.length] ?? "활성";

    const day = ((i % 28) + 1).toString().padStart(2, "0");
    rows.push({
      id: `row-${i + 1}`,
      name: `${name}${Math.floor(i / seedNames.length) + 1}`,
      email: `${name.toLowerCase().replace(/[^a-z]/g, "")}${i + 1}@example.com`,
      department,
      role,
      status,
      lastSeen: `2025-09-${day}`,
      points: 100 + ((i * 37) % 1900),
    });
  }
  return rows;
}

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "이름",
    accessor: (row) => row.name,
    defaultWidth: 140,
  },
  {
    id: "email",
    header: "이메일",
    accessor: (row) => row.email,
    defaultWidth: 220,
  },
  {
    id: "department",
    header: "부서",
    accessor: (row) => row.department,
    defaultWidth: 120,
  },
  {
    id: "role",
    header: "역할",
    accessor: (row) => row.role,
    defaultWidth: 110,
  },
  {
    id: "status",
    header: "상태",
    accessor: (row) => row.status,
    defaultWidth: 100,
  },
  {
    id: "points",
    header: "포인트",
    accessor: (row) => row.points,
    align: "right",
    defaultWidth: 110,
  },
  {
    id: "lastSeen",
    header: "최근 접속",
    accessor: (row) => row.lastSeen,
    defaultWidth: 130,
  },
];

const meta = {
  title: "Shared/UI/DataTable",
  component: DataTable<Row>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "관리자 화면용 재사용 가능한 데이터 테이블. 컬럼 리사이즈, 정렬, 필터, 행 가상화, 일괄 액션, CSV 내보내기를 옵션으로 활성화한다.",
      },
    },
  },
  args: {
    label: "사용자",
    columns,
    getRowId: (row: Row) => row.id,
  },
} satisfies Meta<typeof DataTable<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: generateRows(24),
    enableResize: true,
    enableSort: true,
    enableFilter: true,
    enableSelection: true,
    enableVirtualization: false,
    enableCsvExport: true,
    csvFilename: "users.csv",
  },
  render: function DefaultTable(args) {
    return <DataTable<Row> {...args} />;
  },
};

export const Virtualized: Story = {
  args: {
    data: generateRows(2000),
    height: 480,
    rowHeight: 40,
    enableResize: true,
    enableSort: true,
    enableFilter: true,
    enableSelection: true,
    enableVirtualization: true,
    enableCsvExport: true,
    csvFilename: "users-virtual.csv",
  },
  render: function VirtualizedTable(args) {
    return (
      <div>
        <DataTable<Row> {...args} />
        <p className="text-ink-subtle mt-2 text-xs">
          2,000건의 데이터에서 행 단위 windowing으로 일정한 스크롤 성능을
          유지한다.
        </p>
      </div>
    );
  },
};

export const BulkActions: Story = {
  args: {
    data: generateRows(120),
    enableSort: true,
    enableFilter: true,
    enableSelection: true,
    enableVirtualization: true,
    enableCsvExport: true,
    csvFilename: "selected.csv",
    bulkActions: [
      {
        id: "archive",
        label: "선택 항목 보관",
        variant: "secondary",
      },
      {
        id: "export",
        label: "선택 항목 CSV",
        variant: "ghost",
      },
      {
        id: "delete",
        label: "선택 항목 삭제",
        variant: "danger",
      },
    ],
  },
  render: function BulkActionsTable(args) {
    const actions = args.bulkActions ?? [];

    const decorated = actions.map<DataTableBulkAction>((action) => ({
      ...action,
      onSelect: (ids) =>
        toast.info(
          `${action.label} · ${ids.length.toLocaleString("ko-KR")}건 적용`,
        ),
    }));
    return <DataTable<Row> {...args} bulkActions={decorated} />;
  },
};

export const CustomCell: Story = {
  args: {
    data: generateRows(50),
    enableSelection: true,
    enableCsvExport: true,
    csvFilename: "users-custom.csv",
  },
  render: function CustomCellTable(args) {
    const customColumns: DataTableColumn<Row>[] = useMemo(
      () => [
        ...columns.slice(0, 3),
        {
          id: "role",
          header: "역할",
          accessor: (row) => row.role,
          defaultWidth: 110,
        },
        {
          id: "status",
          header: "상태",
          accessor: (row) => row.status,
          defaultWidth: 100,
          sortable: false,
          filterable: false,
        },
        ...columns.slice(5),
      ],
      [],
    );
    return (
      <DataTable<Row>
        {...args}
        columns={customColumns}
        toolbarExtras={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toast.info("새 사용자 추가")}
          >
            사용자 추가
          </Button>
        }
      />
    );
  },
};

export const Loading: Story = {
  args: {
    data: [],
    isLoading: true,
    enableFilter: true,
    enableSort: true,
  },
  render: function LoadingTable(args) {
    return <DataTable<Row> {...args} />;
  },
};

export const Empty: Story = {
  args: {
    data: [],
    isLoading: false,
    enableFilter: true,
    emptyMessage: "조건에 맞는 사용자가 없습니다.",
  },
  render: function EmptyTable(args) {
    return <DataTable<Row> {...args} />;
  },
};

export const NarrowViewport: Story = {
  args: {
    data: generateRows(20),
    enableResize: true,
    enableSelection: true,
    enableCsvExport: true,
    csvFilename: "users-narrow.csv",
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] max-w-full">
        <Story />
      </div>
    ),
  ],
  render: function NarrowTable(args) {
    return <DataTable<Row> {...args} />;
  },
};

export const WithCallbacks: Story = {
  args: {
    data: generateRows(30),
    enableSelection: true,
    enableCsvExport: true,
    csvFilename: "users-callback.csv",
    bulkActions: [
      {
        id: "report",
        label: "선택 리포트",
        variant: "primary",
        onSelect: fn(),
      },
    ],
  },
  render: function CallbackTable(args) {
    return <DataTable<Row> {...args} />;
  },
};

export const WithCustomCsvAccessor: Story = {
  args: {
    data: generateRows(15),
    enableCsvExport: true,
    csvFilename: "users-custom-csv.csv",
  },
  render: function CustomCsvTable(args) {
    return (
      <DataTable<Row>
        {...args}
        csvAccessor={(row) => ({
          이름: row.name,
          이메일: row.email,
          부서: row.department,
          상태: row.status,
          포인트: row.points.toLocaleString("ko-KR"),
        })}
      />
    );
  },
};

export const BadgeExample: Story = {
  args: {
    data: generateRows(12),
    enableSelection: true,
  },
  render: function BadgeTable(args) {
    return (
      <DataTable<Row>
        {...args}
        columns={[
          ...columns.slice(0, 4),
          {
            id: "status",
            header: "상태 배지",
            accessor: (row) => row.status,
            defaultWidth: 120,
          },
        ]}
        toolbarExtras={
          <Badge variant="info" className="px-3 py-1">
            예시 배지
          </Badge>
        }
      />
    );
  },
};
