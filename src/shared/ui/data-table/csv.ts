export type CsvCell = string | number | boolean | null | undefined;

function escapeCell(value: CsvCell): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv<T>(
  rows: readonly T[],
  columns: ReadonlyArray<{ header: string; accessor: (row: T) => CsvCell }>,
): string {
  const headerLine = columns.map((col) => escapeCell(col.header)).join(",");

  const body = rows.map((row) =>
    columns.map((col) => escapeCell(col.accessor(row))).join(","),
  );
  return [headerLine, ...body].join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  if (typeof document === "undefined") return;
  const bom = "\uFEFF";

  const blob = new Blob([`${bom}${csv}`], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
