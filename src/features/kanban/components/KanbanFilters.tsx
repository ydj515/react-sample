import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { Button } from "@/shared/ui/button";
import { SearchInput } from "@/shared/ui/search-input";
import { Select } from "@/shared/ui/select";
import {
  kanbanColumnIds,
  kanbanColumnLabels,
  kanbanPriorities,
  kanbanPriorityLabels,
} from "@/features/kanban/model/kanban-schema";
import type {
  KanbanCard,
  KanbanSearch,
} from "@/features/kanban/model/kanban-schema";

export function KanbanFilters({
  search,
  cards,
  onChange,
  onReset,
}: {
  search: KanbanSearch;
  cards: KanbanCard[];
  onChange: (patch: Partial<KanbanSearch>) => void;
  onReset?: () => void;
}) {
  const assignees = Array.from(
    new Map(cards.map((card) => [card.assignee.id, card.assignee])).values(),
  );
  return (
    <FilterBar>
      <FilterField label="검색" grow>
        <SearchInput
          value={search.q}
          placeholder="제목, 설명, 담당자, 태그"
          onChange={(event) => onChange({ q: event.target.value })}
        />
      </FilterField>
      <FilterField label="컬럼">
        <Select
          aria-label="칸반 컬럼 필터"
          value={search.column}
          onChange={(event) =>
            onChange({ column: event.target.value as KanbanSearch["column"] })
          }
        >
          <option value="all">전체 컬럼</option>
          {kanbanColumnIds.map((column) => (
            <option key={column} value={column}>
              {kanbanColumnLabels[column]}
            </option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="우선순위">
        <Select
          aria-label="칸반 우선순위 필터"
          value={search.priority}
          onChange={(event) =>
            onChange({
              priority: event.target.value as KanbanSearch["priority"],
            })
          }
        >
          <option value="all">전체 우선순위</option>
          {kanbanPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {kanbanPriorityLabels[priority]}
            </option>
          ))}
        </Select>
      </FilterField>
      <FilterField label="담당자">
        <Select
          aria-label="칸반 담당자 필터"
          value={search.assignee}
          onChange={(event) => onChange({ assignee: event.target.value })}
        >
          <option value="all">전체 담당자</option>
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {assignee.name}
            </option>
          ))}
        </Select>
      </FilterField>
      {onReset ? (
        <Button type="button" variant="secondary" onClick={onReset}>
          초기화
        </Button>
      ) : null}
    </FilterBar>
  );
}
