import { describe, it, expect } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { selectUsers } from "./user-utils";
import { usersSearchSchema } from "./user-schema";

describe("user filters", () => {
  it("역할과 상태를 동시에 적용한다", () => {
    const result = selectUsers(
      managementFixture.users,
      usersSearchSchema.parse({ role: "manager", status: "active" }),
    );
    expect(result.total).toBeGreaterThan(0);
    expect(
      result.items.every((u) => u.role === "manager" && u.status === "active"),
    ).toBe(true);
  });
  it.each(["newest", "oldest", "name"])(
    "%s 정렬은 원본 배열을 변경하지 않는다",
    (sort) => {
      const items = managementFixture.users;
      const before = [...items];
      const result = selectUsers(items, usersSearchSchema.parse({ sort }));
      expect(result.items[0]?.id).toBe(
        sort === "newest" ? "user-24" : sort === "name" ? "user-10" : "user-1",
      );
      expect(items).toEqual(before);
    },
  );
});
