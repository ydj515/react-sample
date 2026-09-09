import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("조건부 class와 Tailwind 충돌 class를 정리한다", () => {
    expect(cn("px-2 text-sm", { hidden: false }, "px-4")).toBe("text-sm px-4");
  });
  it("의미 기반 모서리 토큰을 표준 유틸리티로 덮어쓴다", () => {
    expect(cn("rounded-panel", "rounded-none")).toBe("rounded-none");
    expect(cn("rounded-none", "rounded-panel")).toBe("rounded-panel");
    expect(cn("rounded-control", "rounded-full")).toBe("rounded-full");
    expect(cn("sm:rounded-panel", "sm:rounded-none")).toBe("sm:rounded-none");
  });
});
