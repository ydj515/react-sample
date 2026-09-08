import type { DashboardSearch } from "@/features/dashboard/model/dashboard-utils";
import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";

export function DashboardFilters({
  filters,
  owners,
  onChange,
  onRefresh,
  refreshing,
}: {
  filters: DashboardSearch;
  owners: string[];
  onChange: (filters: DashboardSearch) => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <FilterBar>
      <FilterField label="집계 기간">
        <Select
          value={filters.days}
          onChange={(event) =>
            onChange({
              ...filters,
              days: Number(event.target.value) as DashboardSearch["days"],
            })
          }
        >
          {[7, 30, 90].map((days) => (
            <option key={days} value={days}>
              최근 {days}일
            </option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="프로젝트 담당자">
        <Select
          className="max-w-56"
          value={filters.owner}
          onChange={(event) =>
            onChange({ ...filters, owner: event.target.value })
          }
        >
          <option value="all">전체 담당자</option>
          {!owners.includes(filters.owner) && filters.owner !== "all" ? (
            <option value={filters.owner}>알 수 없는 담당자</option>
          ) : null}
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="프로젝트 상태">
        <Select
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as DashboardSearch["status"],
            })
          }
        >
          <option value="all">전체 상태</option>
          <option value="active">진행 중</option>
          <option value="paused">일시 중지</option>
          <option value="completed">완료</option>
        </Select>
      </FilterField>
      <div className="flex gap-2 sm:ml-auto">
        <Button
          variant="secondary"
          onClick={() =>
            onChange({
              days: 30,
              owner: "all",
              status: "all",
              metric: "completed",
            })
          }
        >
          초기화
        </Button>
        <Button variant="secondary" disabled={refreshing} onClick={onRefresh}>
          {refreshing ? "갱신 중…" : "새로고침"}
        </Button>
      </div>
    </FilterBar>
  );
}
