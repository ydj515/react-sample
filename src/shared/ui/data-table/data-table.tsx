import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronDown, ChevronUp, Download, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/cn";
import "./data-table.css";
import { downloadCsv, toCsv, type CsvCell } from "./csv";
import {
  computeColumnWidths,
  filterRows,
  nextResize,
  sortRows,
  toggleSort,
  type ColumnFilterState,
  type ColumnSortState,
  type DataTableColumn,
  type ResizeState,
} from "./data-table-utils";

const DEFAULT_ROW_HEIGHT = 44;

const DEFAULT_VIEW_HEIGHT = 480;

export type DataTableBulkAction = {
  id: string;
  label: string;
  onSelect?: (selectedIds: string[]) => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
};

export type DataTableProps<T> = {
  data: readonly T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  label: string;
  rowHeight?: number;
  height?: number;
  emptyMessage?: string;
  isLoading?: boolean;
  enableResize?: boolean;
  enableSort?: boolean;
  enableFilter?: boolean;
  enableVirtualization?: boolean;
  enableSelection?: boolean;
  enableCsvExport?: boolean;
  csvFilename?: string;
  csvAccessor?: (row: T) => Record<string, CsvCell>;
  bulkActions?: DataTableBulkAction[];
  toolbarExtras?: ReactNode;
  className?: string;
};

export function DataTable<T>({
  data,
  columns,
  getRowId,
  label,
  rowHeight = DEFAULT_ROW_HEIGHT,
  height = DEFAULT_VIEW_HEIGHT,
  emptyMessage = "표시할 데이터가 없습니다.",
  isLoading = false,
  enableResize = true,
  enableSort = true,
  enableFilter = true,
  enableVirtualization = true,
  enableSelection = false,
  enableCsvExport = false,
  csvFilename = "data.csv",
  csvAccessor,
  bulkActions,
  toolbarExtras,
  className,
}: DataTableProps<T>) {
  const [sorts, setSorts] = useState<ColumnSortState[]>([]);

  const [filters, setFilters] = useState<ColumnFilterState[]>([]);

  const [resizes, setResizes] = useState<ResizeState>({});

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columnWidths = useMemo(
    () => computeColumnWidths(columns, resizes),
    [columns, resizes],
  );

  const selectionColumnWidth = 44;

  const totalWidth = useMemo(() => {
    const columnsWidth = columns.reduce(
      (sum, column) => sum + (columnWidths[column.id] ?? 0),
      0,
    );
    return columnsWidth + (enableSelection ? selectionColumnWidth : 0);
  }, [columns, columnWidths, enableSelection]);

  const filteredRows = useMemo(
    () => (enableFilter ? filterRows(data, filters, columns) : [...data]),
    [data, filters, columns, enableFilter],
  );

  const sortedRows = useMemo(
    () =>
      enableSort && sorts.length > 0
        ? sortRows(filteredRows, sorts, columns)
        : filteredRows,
    [filteredRows, sorts, columns, enableSort],
  );

  const visibleIds = useMemo(
    () => sortedRows.map((row) => getRowId(row)),
    [sortedRows, getRowId],
  );

  const allSelected =
    enableSelection &&
    visibleIds.length > 0 &&
    selectedIds.length === visibleIds.length;

  const partiallySelected =
    enableSelection &&
    selectedIds.length > 0 &&
    selectedIds.length < visibleIds.length;

  const onToggleAll = useCallback(() => {
    if (!enableSelection) return;
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...visibleIds]);
    }
  }, [allSelected, visibleIds, enableSelection]);

  const onToggleRow = useCallback(
    (rowId: string) => {
      if (!enableSelection) return;
      setSelectedIds((current) =>
        current.includes(rowId)
          ? current.filter((id) => id !== rowId)
          : [...current, rowId],
      );
    },
    [enableSelection],
  );

  const onSortToggle = useCallback(
    (columnId: string, event: { shiftKey: boolean }) => {
      if (!enableSort) return;
      setSorts((current) => toggleSort(current, columnId, event.shiftKey));
    },
    [enableSort],
  );

  const onFilterChange = useCallback(
    (columnId: string, value: string) => {
      if (!enableFilter) return;
      setFilters((current) => {
        const filtered = current.filter((filter) => filter.id !== columnId);
        return value.trim() === ""
          ? filtered
          : [...filtered, { id: columnId, value }];
      });
    },
    [enableFilter],
  );

  const onFilterClear = useCallback(
    (columnId: string) => onFilterChange(columnId, ""),
    [onFilterChange],
  );

  const onResizeStart = useCallback(
    (columnId: string, startWidth: number, event: React.PointerEvent) => {
      if (!enableResize) return;
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);
      const startX = event.clientX;

      const onMove = (moveEvent: Event) => {
        const pointer = moveEvent as PointerEvent;

        const next = startWidth + (pointer.clientX - startX);
        setResizes((current) => nextResize(current, columnId, next));
      };

      const onUp = (upEvent: Event) => {
        const pointer = upEvent as PointerEvent;
        target.releasePointerCapture(pointer.pointerId);
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onUp);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
    },
    [enableResize],
  );

  const handleSortKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, columnId: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSortToggle(columnId, event);
      }
    },
    [onSortToggle],
  );

  const onCsvDownload = useCallback(() => {
    if (!enableCsvExport) return;
    const exportRows = sortedRows;

    const exportColumns =
      csvAccessor === undefined
        ? columns.map((col) => ({
            header: col.header,
            accessor: (row: T) => col.accessor(row) as CsvCell,
          }))
        : columns.map((col) => ({
            header: col.header,
            accessor: (row: T) => csvAccessor(row)[col.id] ?? col.accessor(row),
          }));

    const csv = toCsv(exportRows, exportColumns);
    downloadCsv(csvFilename, csv);
  }, [enableCsvExport, sortedRows, columns, csvAccessor, csvFilename]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: sortedRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: enableVirtualization ? 8 : 0,
    enabled: enableVirtualization,
  });

  const totalHeight = enableVirtualization
    ? virtualizer.getTotalSize()
    : sortedRows.length * rowHeight;

  const virtualRows = enableVirtualization
    ? virtualizer.getVirtualItems()
    : null;

  const renderHeaderRows = () => {
    const filterableColumns = enableFilter
      ? columns.filter((col) => col.filterable !== false)
      : [];

    return (
      <thead>
        <tr>
          {enableSelection ? (
            <th
              scope="col"
              aria-label="선택"
              style={{
                width: selectionColumnWidth,
                minWidth: selectionColumnWidth,
              }}
              className="select-column"
            >
              <SelectionCheckbox
                checked={allSelected}
                partial={partiallySelected}
                onChange={onToggleAll}
                ariaLabel={allSelected ? "전체 선택 해제" : "전체 선택"}
              />
            </th>
          ) : null}
          {columns.map((column) => {
            const width = columnWidths[column.id] ?? column.defaultWidth ?? 160;

            const sort = sorts.find((s) => s.id === column.id);

            const sortable = enableSort && column.sortable !== false;

            const align = column.align ?? "left";
            return (
              <th
                key={column.id}
                scope="col"
                aria-sort={
                  sort === undefined
                    ? undefined
                    : sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                }
                style={{ width, minWidth: width }}
                className={cn("data-table-th", `align-${align}`)}
              >
                <div className="th-inner">
                  {sortable ? (
                    <button
                      type="button"
                      className="th-button"
                      onClick={(event) => onSortToggle(column.id, event)}
                      onKeyDown={(event) => handleSortKey(event, column.id)}
                      aria-label={`${column.header} 정렬`}
                    >
                      <span>{column.header}</span>
                      {sort === undefined ? (
                        <span className="sort-indicator muted" aria-hidden>
                          <ChevronDown className="size-3" />
                        </span>
                      ) : sort.direction === "asc" ? (
                        <span className="sort-indicator" aria-hidden>
                          <ChevronUp className="size-3" />
                        </span>
                      ) : (
                        <span className="sort-indicator" aria-hidden>
                          <ChevronDown className="size-3" />
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="th-text">{column.header}</span>
                  )}
                  {enableResize ? (
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`${column.header} 폭 조절`}
                      tabIndex={-1}
                      className="resize-handle"
                      onPointerDown={(event) =>
                        onResizeStart(column.id, width, event)
                      }
                    />
                  ) : null}
                </div>
              </th>
            );
          })}
        </tr>
        {filterableColumns.length > 0 ? (
          <tr className="filter-row">
            {enableSelection ? (
              <th
                scope="col"
                aria-label="필터 영역"
                style={{
                  width: selectionColumnWidth,
                  minWidth: selectionColumnWidth,
                }}
              />
            ) : null}
            {columns.map((column) => {
              const width =
                columnWidths[column.id] ?? column.defaultWidth ?? 160;

              const filterable = column.filterable !== false;

              const filter = filters.find((f) => f.id === column.id);
              if (!filterable) {
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-hidden
                    style={{ width, minWidth: width, padding: 0 }}
                  />
                );
              }
              return (
                <th
                  key={column.id}
                  scope="col"
                  style={{ width, minWidth: width }}
                  className="filter-cell"
                >
                  <Input
                    type="search"
                    aria-label={`${column.header} 필터`}
                    value={filter?.value ?? ""}
                    onChange={(event) =>
                      onFilterChange(column.id, event.target.value)
                    }
                    placeholder="필터"
                    className="filter-input"
                  />
                  {filter && filter.value !== "" ? (
                    <button
                      type="button"
                      onClick={() => onFilterClear(column.id)}
                      aria-label={`${column.header} 필터 지우기`}
                      className="filter-clear"
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  ) : null}
                </th>
              );
            })}
          </tr>
        ) : null}
      </thead>
    );
  };

  const renderRow = (row: T, rowIndex: number, top?: number) => {
    const rowId = getRowId(row);

    const selected = selectedIds.includes(rowId);
    return (
      <tr
        key={rowId}
        aria-selected={enableSelection ? selected : undefined}
        className={cn("data-table-row", selected && "is-selected")}
        style={
          top !== undefined
            ? { position: "absolute", top, height: rowHeight }
            : { height: rowHeight }
        }
      >
        {enableSelection ? (
          <td
            className="select-column"
            style={{
              width: selectionColumnWidth,
              minWidth: selectionColumnWidth,
            }}
          >
            <SelectionCheckbox
              checked={selected}
              onChange={() => onToggleRow(rowId)}
              ariaLabel={`${rowId} 행 선택`}
            />
          </td>
        ) : null}
        {columns.map((column) => {
          const width = columnWidths[column.id] ?? column.defaultWidth ?? 160;

          const value = column.accessor(row);

          const align = column.align ?? "left";
          return (
            <td
              key={column.id}
              style={{ width, minWidth: width }}
              className={cn("data-table-cell", `align-${align}`)}
              data-row-index={rowIndex}
            >
              {value === null || value === undefined ? "" : String(value)}
            </td>
          );
        })}
      </tr>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr
              key={`skeleton-${index}`}
              className="data-table-row skeleton"
              style={{ height: rowHeight }}
              aria-hidden
            >
              {enableSelection ? (
                <td
                  className="select-column"
                  style={{
                    width: selectionColumnWidth,
                    minWidth: selectionColumnWidth,
                  }}
                />
              ) : null}
              {columns.map((column) => {
                const width =
                  columnWidths[column.id] ?? column.defaultWidth ?? 160;
                return (
                  <td
                    key={column.id}
                    style={{ width, minWidth: width }}
                    className="data-table-cell"
                  >
                    <span className="skeleton-bar" />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      );
    }

    if (sortedRows.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length + (enableSelection ? 1 : 0)}
              className="empty-row"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    if (enableVirtualization && virtualRows !== null) {
      return (
        <tbody
          style={{
            display: "block",
            height: totalHeight,
            position: "relative",
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = sortedRows[virtualRow.index];
            if (!row) return null;
            return renderRow(row, virtualRow.index, virtualRow.start);
          })}
        </tbody>
      );
    }

    return (
      <tbody>{sortedRows.map((row, index) => renderRow(row, index))}</tbody>
    );
  };

  const totalRowCount = sortedRows.length;

  const selectedRowCount = enableSelection ? selectedIds.length : 0;

  return (
    <div className={cn("data-table-wrapper", className)}>
      <div
        role="toolbar"
        aria-label={`${label} 도구 모음`}
        className="data-table-toolbar"
      >
        <p
          className="row-count"
          aria-live="polite"
          data-testid={`${label}-row-count`}
        >
          총{" "}
          <span className="font-semibold tabular-nums">
            {totalRowCount.toLocaleString("ko-KR")}
          </span>
          건
          {enableSelection && selectedRowCount > 0 ? (
            <>
              {" · 선택 "}
              <span className="font-semibold tabular-nums">
                {selectedRowCount.toLocaleString("ko-KR")}
              </span>
              건
            </>
          ) : null}
        </p>
        <div className="toolbar-actions">
          {enableSelection &&
          selectedRowCount > 0 &&
          bulkActions &&
          bulkActions.length > 0
            ? bulkActions.map((action) => (
                <Button
                  key={action.id}
                  type="button"
                  variant={action.variant ?? "secondary"}
                  size="sm"
                  disabled={action.disabled}
                  onClick={() => action.onSelect?.(selectedIds)}
                >
                  {action.label}
                </Button>
              ))
            : null}
          {toolbarExtras}
          {enableCsvExport ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCsvDownload}
              disabled={sortedRows.length === 0}
            >
              <Download className="size-4" aria-hidden />
              CSV
            </Button>
          ) : null}
        </div>
      </div>
      <div
        ref={scrollRef}
        role="region"
        aria-label={`${label} 스크롤`}
        tabIndex={0}
        className={cn(
          "data-table-scroll",
          enableVirtualization && "is-virtual",
        )}
        style={
          enableVirtualization
            ? ({ height, maxHeight: height } as const)
            : { maxHeight: height }
        }
      >
        <table
          style={{ minWidth: totalWidth, width: totalWidth }}
          className="data-table"
          aria-busy={isLoading || undefined}
        >
          <caption className="sr-only">{label}</caption>
          {renderHeaderRows()}
          {renderBody()}
        </table>
      </div>
    </div>
  );
}

function SelectionCheckbox({
  checked,
  partial,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  partial?: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <label className="selection-checkbox">
      <input
        type="checkbox"
        checked={checked}
        ref={(node) => {
          if (node) node.indeterminate = Boolean(partial) && !checked;
        }}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className="checkbox-box" aria-hidden>
        {checked && !partial ? <Check className="size-3" /> : null}
      </span>
    </label>
  );
}
