import type {
  ProjectFilters,
  ProjectSortKey,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

type ProjectFiltersProps = {
  filters: ProjectFilters;
  sortKey: ProjectSortKey;
  onFiltersChange: (filters: ProjectFilters) => void;
  onSortKeyChange: (sortKey: ProjectSortKey) => void;
};

export function ProjectFilters({
  filters,
  onFiltersChange,
  onSortKeyChange,
  sortKey,
}: ProjectFiltersProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">
      <div>
        <Label htmlFor="project-search">검색</Label>
        <Input
          id="project-search"
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="프로젝트 또는 담당자 검색"
        />
      </div>
      <div>
        <Label htmlFor="project-status">프로젝트 상태</Label>
        <Select
          id="project-status"
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              status: event.target.value as ProjectStatus | "all",
            })
          }
          className="w-full"
        >
          <option value="all">전체</option>
          <option value="active">진행 중</option>
          <option value="paused">일시 중지</option>
          <option value="completed">완료</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="project-sort">정렬 기준</Label>
        <Select
          id="project-sort"
          value={sortKey}
          onChange={(event) =>
            onSortKeyChange(event.target.value as ProjectSortKey)
          }
          className="w-full"
        >
          <option value="dueDate">마감일</option>
          <option value="updatedAt">최근 수정</option>
          <option value="name">이름</option>
        </Select>
      </div>
    </div>
  );
}
