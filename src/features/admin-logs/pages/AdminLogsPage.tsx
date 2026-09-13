import { QueryBoundary } from "@/shared/ui/query-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "@/stores/toast-store";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { PageHeader } from "@/shared/ui/page-header";
import { Select } from "@/shared/ui/select";
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
} from "@/shared/ui/data-table";
import { adminLogsQueryOptions } from "@/features/admin-logs/queries/admin-log-queries";
import {
  adminLogChannels,
  adminLogChannelsLabels,
  adminLogSeverities,
  adminLogSeveritiesLabels,
  adminLogsQuerySchema,
} from "@/features/admin-logs/model/admin-log-schema";
import {
  countAdminLogsByChannel,
  countAdminLogsBySeverity,
} from "@/features/admin-logs/model/admin-log-utils";
import type { AdminLog } from "@/features/admin-logs/model/admin-log-schema";
import { formatLogDateTime } from "@/mocks/data/admin-logs";

function severityVariant(
  severity: AdminLog["severity"],
): "info" | "warning" | "danger" {
  if (severity === "info") return "info";
  if (severity === "warning") return "warning";
  return "danger";
}

function severityText(severity: AdminLog["severity"]): string {
  return adminLogSeveritiesLabels[severity];
}

const columns: DataTableColumn<AdminLog>[] = [
  {
    id: "occurredAt",
    header: "발생 시각",
    accessor: (row) => formatLogDateTime(row.occurredAt),
    defaultWidth: 180,
  },
  {
    id: "severity",
    header: "심각도",
    accessor: (row) => severityText(row.severity),
    defaultWidth: 110,
  },
  {
    id: "channel",
    header: "채널",
    accessor: (row) => adminLogChannelsLabels[row.channel],
    defaultWidth: 110,
  },
  {
    id: "actor",
    header: "주체",
    accessor: (row) => row.actor,
    defaultWidth: 200,
  },
  {
    id: "message",
    header: "메시지",
    accessor: (row) => row.message,
    defaultWidth: 280,
  },
  {
    id: "resource",
    header: "대상 리소스",
    accessor: (row) => row.resource,
    defaultWidth: 220,
  },
];

function AdminLogsPageContent() {
  const navigate = useNavigate();

  const search = adminLogsQuerySchema.parse(useSearch({ strict: false }));

  const query = useSuspenseQuery(adminLogsQueryOptions());

  const logs = query.data ?? [];

  const change = (patch: Partial<typeof search>) =>
    void navigate({
      to: "/admin/logs",
      search: { ...search, ...patch },
      replace: true,
    });

  const channelCounts = countAdminLogsByChannel(logs);

  const severityCounts = countAdminLogsBySeverity(logs);

  const bulkActions: DataTableBulkAction[] = [
    {
      id: "acknowledge",
      label: "선택 확인 처리",
      variant: "secondary",
      onSelect: (ids) =>
        toast.success(
          `${ids.length.toLocaleString("ko-KR")}건 확인 처리했습니다.`,
        ),
    },
    {
      id: "export",
      label: "선택 CSV",
      variant: "ghost",
      onSelect: (ids) =>
        toast.info(`${ids.length.toLocaleString("ko-KR")}건 CSV 내보내기 요청`),
    },
  ];

  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="관리자 활동 로그"
        description="시스템에서 발생하는 주요 이벤트와 운영자 액션을 한 화면에서 확인하세요."
        actions={
          <Button
            type="button"
            variant="secondary"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            새로고침
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {adminLogChannels.map((channel) => (
          <Card key={channel} className="p-4">
            <p className="text-ink-subtle text-xs">
              {adminLogChannelsLabels[channel]}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {(channelCounts[channel] ?? 0).toLocaleString("ko-KR")}
              <span className="text-ink-subtle ml-1 text-xs font-normal">
                건
              </span>
            </p>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-ink-subtle text-xs font-medium">심각도 분포</span>
        {adminLogSeverities.map((severity) => (
          <Badge key={severity} variant={severityVariant(severity)}>
            {severityText(severity)}{" "}
            <span className="ml-1 font-semibold tabular-nums">
              {(severityCounts[severity] ?? 0).toLocaleString("ko-KR")}
            </span>
          </Badge>
        ))}
      </div>
      <FilterBar>
        <FilterField label="채널">
          <Select
            value={search.channel}
            onChange={(event) =>
              change({ channel: event.target.value as typeof search.channel })
            }
          >
            <option value="all">전체 채널</option>
            {adminLogChannels.map((channel) => (
              <option key={channel} value={channel}>
                {adminLogChannelsLabels[channel]}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="심각도">
          <Select
            value={search.severity}
            onChange={(event) =>
              change({
                severity: event.target.value as typeof search.severity,
              })
            }
          >
            <option value="all">전체 심각도</option>
            {adminLogSeverities.map((severity) => (
              <option key={severity} value={severity}>
                {severityText(severity)}
              </option>
            ))}
          </Select>
        </FilterField>
        <Button
          type="button"
          variant="secondary"
          onClick={() => change(adminLogsQuerySchema.parse({}))}
        >
          초기화
        </Button>
      </FilterBar>
      <DataTable<AdminLog>
        label="관리자 활동 로그"
        data={logs.filter((log) => {
          if (search.channel !== "all" && log.channel !== search.channel) {
            return false;
          }
          if (search.severity !== "all" && log.severity !== search.severity) {
            return false;
          }
          return true;
        })}
        columns={columns}
        getRowId={(row) => row.id}
        height={520}
        rowHeight={44}
        enableResize
        enableSort
        enableFilter
        enableSelection
        enableVirtualization
        enableCsvExport
        csvFilename="admin-logs.csv"
        bulkActions={bulkActions}
      />
    </section>
  );
}

export function AdminLogsPage() {
  return (
    <QueryBoundary>
      <AdminLogsPageContent />
    </QueryBoundary>
  );
}
