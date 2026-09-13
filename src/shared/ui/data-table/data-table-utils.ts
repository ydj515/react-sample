import type { CsvCell } from "./csv";

export type SortDirection = "asc" | "desc";

export type ColumnSortState = { id: string; direction: SortDirection };

export type ColumnFilterState = { id: string; value: string };

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor: (row: T) => CsvCell;
  sortable?: boolean;
  filterable?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  align?: "left" | "right" | "center";
};

export type ResizeState = Record<string, number>;

export function compareCells(a: CsvCell, b: CsvCell): number {
  const aMissing = a === null || a === undefined || a === "";

  const bMissing = b === null || b === undefined || b === "";
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "ko-KR", {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortRows<T>(
  rows: readonly T[],
  sorts: readonly ColumnSortState[],
  columns: readonly DataTableColumn<T>[],
): T[] {
  if (sorts.length === 0) return [...rows];
  const columnMap = new Map(columns.map((col) => [col.id, col]));
  return [...rows].sort((left, right) => {
    for (const sort of sorts) {
      const column = columnMap.get(sort.id);
      if (!column) continue;
      const compare = compareCells(
        column.accessor(left),
        column.accessor(right),
      );
      if (compare === 0) continue;
      return sort.direction === "asc" ? compare : -compare;
    }
    return 0;
  });
}

export function filterRows<T>(
  rows: readonly T[],
  filters: readonly ColumnFilterState[],
  columns: readonly DataTableColumn<T>[],
): T[] {
  const activeFilters = filters.filter((filter) => filter.value.trim() !== "");
  if (activeFilters.length === 0) return [...rows];
  const columnMap = new Map(columns.map((col) => [col.id, col]));

  const normalized = activeFilters.map((filter) => ({
    id: filter.id,
    value: filter.value.trim().toLocaleLowerCase("ko-KR"),
  }));
  return rows.filter((row) =>
    normalized.every((filter) => {
      const column = columnMap.get(filter.id);
      if (!column) return true;
      const raw = column.accessor(row);
      if (raw === null || raw === undefined) return false;
      return String(raw).toLocaleLowerCase("ko-KR").includes(filter.value);
    }),
  );
}

export function toggleSort(
  sorts: readonly ColumnSortState[],
  columnId: string,
  multi: boolean,
): ColumnSortState[] {
  const existing = sorts.find((sort) => sort.id === columnId);
  if (!existing) {
    return multi
      ? [...sorts, { id: columnId, direction: "asc" }]
      : [{ id: columnId, direction: "asc" }];
  }
  if (existing.direction === "asc") {
    return sorts.map((sort) =>
      sort.id === columnId ? { ...sort, direction: "desc" as const } : sort,
    );
  }
  return sorts.filter((sort) => sort.id !== columnId);
}

export function computeColumnWidths<T>(
  columns: readonly DataTableColumn<T>[],
  resizes: ResizeState,
): Record<string, number> {
  const widths: Record<string, number> = {};
  for (const column of columns) {
    const override = resizes[column.id];

    const fallback = column.defaultWidth ?? 160;
    widths[column.id] = Math.max(column.minWidth ?? 80, override ?? fallback);
  }
  return widths;
}

export function nextResize(
  resizes: ResizeState,
  columnId: string,
  nextWidth: number,
): ResizeState {
  return { ...resizes, [columnId]: Math.max(40, Math.round(nextWidth)) };
}
