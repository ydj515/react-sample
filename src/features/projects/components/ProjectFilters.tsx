import type {
  ProjectFilters,
  ProjectSortKey,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { SearchInput } from "@/shared/ui/search-input";
import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { Button } from "@/shared/ui/button";
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
    <FilterBar>
      <FilterField label="검색" grow>
        <SearchInput
          id="project-search"
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="프로젝트 또는 담당자 검색"
        />
      </FilterField>
      <FilterField label="프로젝트 상태">
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
      </FilterField>
      <FilterField label="정렬 기준">
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
      </FilterField>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          onFiltersChange({ search: "", status: "all" });
          onSortKeyChange("dueDate");
        }}
      >
        초기화
      </Button>
    </FilterBar>
  );
}
