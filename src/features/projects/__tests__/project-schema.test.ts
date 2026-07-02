import { describe, expect, it } from "vitest";

import { createProjectSchema } from "@/features/projects/model/project-schema";

describe("createProjectSchema", () => {
  it("프로젝트 생성 입력을 검증한다", () => {
    const result = createProjectSchema.safeParse({
      name: "Design System",
      owner: "Mina",
      status: "active",
      dueDate: "2026-08-01",
      description: "공통 UI 기반을 정리한다.",
    });

    expect(result.success).toBe(true);
  });

  it("짧은 이름과 잘못된 상태를 거부한다", () => {
    const result = createProjectSchema.safeParse({
      name: "A",
      owner: "",
      status: "unknown",
      dueDate: "not-date",
      description: "",
    });

    expect(result.success).toBe(false);
  });
});
