import { describe, expect, it } from "vitest";

import { createTestQueryClient } from "@/shared/lib/test/test-query-client";

describe("createTestQueryClient", () => {
  it("테스트에서 재시도와 캐시 유지 시간을 비활성화한다", () => {
    const queryClient = createTestQueryClient();

    expect(queryClient.getDefaultOptions().queries?.retry).toBe(false);
    expect(queryClient.getDefaultOptions().queries?.gcTime).toBe(0);
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false);
  });
});
