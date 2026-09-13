import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";
import {
  compareCells,
  computeColumnWidths,
  filterRows,
  sortRows,
  toggleSort,
  type DataTableColumn,
} from "./data-table-utils";

type Row = { id: string; name: string; amount: number; note: string | null };

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "이름",
    accessor: (row) => row.name,
    defaultWidth: 140,
  },
  {
    id: "amount",
    header: "금액",
    accessor: (row) => row.amount,
    align: "right",
    defaultWidth: 100,
  },
  {
    id: "note",
    header: "메모",
    accessor: (row) => row.note,
    defaultWidth: 200,
  },
];

const sample: Row[] = [
  { id: "1", name: "감귤", amount: 1200, note: "제주" },
  { id: "2", name: "사과", amount: 800, note: null },
  { id: "3", name: "바나나", amount: 1500, note: "수입" },
  { id: "4", name: "포도", amount: 2200, note: "당도 높음" },
];

describe("toCsv", () => {
  it("헤더와 본문을 콤마로 결합하고 콤마/따옴표/줄바꿈을 이스케이프한다", () => {
    const csv = toCsv(
      [{ label: 'He said "hi"', value: 2, note: "a,b\nc" }],
      [
        { header: "Label", accessor: (row) => row.label },
        { header: "Value", accessor: (row) => row.value },
        { header: "Note", accessor: (row) => row.note },
      ],
    );
    expect(csv).toBe('Label,Value,Note\r\n"He said ""hi""",2,"a,b\nc"');
  });

  it("null과 undefined는 빈 셀로 변환한다", () => {
    const csv = toCsv(
      [{ a: null, b: undefined }],
      [
        { header: "A", accessor: (row) => row.a },
        { header: "B", accessor: (row) => row.b },
      ],
    );
    expect(csv).toBe("A,B\r\n,");
  });
});

describe("compareCells", () => {
  it("숫자는 산술 비교한다", () => {
    expect(compareCells(2, 10)).toBeLessThan(0);
  });

  it("문자는 로케일 기반으로 비교한다", () => {
    expect(compareCells("감귤", "사과")).toBeLessThan(0);
  });

  it("빈 값은 항상 뒤로 정렬한다", () => {
    expect(compareCells(null, "사과")).toBeGreaterThan(0);
    expect(compareCells("사과", undefined)).toBeLessThan(0);
  });
});

describe("sortRows", () => {
  it("단일 컬럼 asc/desc 정렬을 수행한다", () => {
    const asc = sortRows(sample, [{ id: "amount", direction: "asc" }], columns);
    expect(asc.map((row) => row.id)).toEqual(["2", "1", "3", "4"]);

    const desc = sortRows(
      sample,
      [{ id: "amount", direction: "desc" }],
      columns,
    );
    expect(desc.map((row) => row.id)).toEqual(["4", "3", "1", "2"]);
  });

  it("정렬 조건이 비어 있으면 원본 순서를 유지한다", () => {
    expect(sortRows(sample, [], columns)).toEqual(sample);
  });

  it("null 값은 항상 뒤로 정렬한다", () => {
    const sorted = sortRows(
      sample,
      [{ id: "note", direction: "asc" }],
      columns,
    );
    expect(sorted.at(-1)?.id).toBe("2");
  });
});

describe("filterRows", () => {
  it("빈 필터 값은 무시한다", () => {
    expect(
      filterRows(
        sample,
        [
          { id: "name", value: "  " },
          { id: "note", value: "" },
        ],
        columns,
      ),
    ).toEqual(sample);
  });

  it("여러 컬럼 필터를 교집합으로 적용한다", () => {
    const result = filterRows(
      sample,
      [
        { id: "name", value: "포도" },
        { id: "note", value: "당도" },
      ],
      columns,
    );
    expect(result.map((row) => row.id)).toEqual(["4"]);
  });

  it("null 필드는 매치되지 않는다", () => {
    const result = filterRows(sample, [{ id: "note", value: "제주" }], columns);
    expect(result.map((row) => row.id)).toEqual(["1"]);
  });
});

describe("toggleSort", () => {
  it("첫 클릭은 asc로 시작한다", () => {
    expect(toggleSort([], "amount", false)).toEqual([
      { id: "amount", direction: "asc" },
    ]);
  });

  it("두 번째 클릭은 desc, 세 번째는 제거한다", () => {
    const afterAsc = toggleSort([], "amount", false);

    const afterDesc = toggleSort(afterAsc, "amount", false);

    const afterRemove = toggleSort(afterDesc, "amount", false);
    expect(afterDesc).toEqual([{ id: "amount", direction: "desc" }]);
    expect(afterRemove).toEqual([]);
  });

  it("multi 모드에서는 다른 컬럼 정렬을 유지한다", () => {
    const result = toggleSort(
      [{ id: "amount", direction: "asc" }],
      "name",
      true,
    );
    expect(result).toEqual([
      { id: "amount", direction: "asc" },
      { id: "name", direction: "asc" },
    ]);
  });
});

describe("computeColumnWidths", () => {
  it("minWidth와 defaultWidth로 폭을 계산한다", () => {
    const widths = computeColumnWidths(columns, {});
    expect(widths.amount).toBe(100);
    expect(widths.name).toBe(140);
  });

  it("resize 값은 minWidth 이상으로 적용된다", () => {
    const widths = computeColumnWidths(
      columns.map((col) => ({ ...col, minWidth: 90 })),
      { amount: 50 },
    );
    expect(widths.amount).toBe(90);
  });
});
