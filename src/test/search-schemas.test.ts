import { expect, it } from "vitest";
import { projectSearchSchema } from "@/features/projects/model/project-search";
import { commerceSearchSchema } from "@/features/dashboard/model/order-search";
import {
  eventSearchSchema,
  agencySearchSchema,
} from "@/features/landing/model/search";
import { docsSearchSchema } from "@/features/docs/model/search";

it("잘못된 URL 조건을 기본값으로 복구한다", () => {
  expect(
    projectSearchSchema.parse({ page: -1, sort: "invalid", status: "invalid" }),
  ).toEqual({ q: "", page: 1, sort: "dueDate", status: "all" });
  expect(eventSearchSchema.parse({ day: "2", track: "Culture" })).toEqual({
    day: 2,
    track: "Culture",
  });
  expect(eventSearchSchema.parse({ day: 9, track: [] })).toEqual({
    day: 1,
    track: "전체",
  });
  expect(agencySearchSchema.parse({ category: "invalid" }).category).toBe(
    "전체",
  );
  expect(docsSearchSchema.parse({ q: [] }).q).toBe("");
  expect(
    commerceSearchSchema.parse({
      orderPage: "2",
      orderFilters: { min: "invalid" },
    }),
  ).toMatchObject({
    orderPage: 2,
    orderSort: "newest",
    orderFilters: { keyword: "", min: "", brands: [] },
  });
});
