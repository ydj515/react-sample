import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { server } from "@/mocks/server";
import { ApiError } from "@/shared/api/api-error";
import { apiRequest } from "@/shared/api/http-client";

const responseSchema = z.object({ id: z.string() });

describe("apiRequest", () => {
  it("returns JSON parsed by the response schema", async () => {
    server.use(
      http.get("/api/http-client/valid", () =>
        HttpResponse.json({ id: "project-1" }),
      ),
    );

    await expect(
      apiRequest("/api/http-client/valid", { schema: responseSchema }),
    ).resolves.toEqual({ id: "project-1" });
  });

  it("preserves standardized HTTP error fields", async () => {
    server.use(
      http.get("/api/http-client/failure", () =>
        HttpResponse.json(
          {
            code: "PROJECT_INVALID",
            message: "프로젝트 요청이 올바르지 않습니다.",
            path: "/api/http-client/failure",
            traceId: "trace-body-1",
          },
          {
            status: 422,
            headers: { "X-Trace-Id": "trace-header-ignored" },
          },
        ),
      ),
    );

    const request = apiRequest("/api/http-client/failure", {
      schema: responseSchema,
    });

    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({
      status: 422,
      code: "PROJECT_INVALID",
      message: "프로젝트 요청이 올바르지 않습니다.",
      path: "/api/http-client/failure",
      traceId: "trace-body-1",
    });
  });

  it("uses the response header when the error body has no trace ID", async () => {
    server.use(
      http.get("/api/http-client/header-trace", () =>
        HttpResponse.json(
          { code: "FAILED", message: "실패했습니다." },
          { status: 500, headers: { "X-Trace-Id": "trace-header-1" } },
        ),
      ),
    );

    await expect(
      apiRequest("/api/http-client/header-trace", { schema: responseSchema }),
    ).rejects.toMatchObject({ traceId: "trace-header-1" });
  });

  it.each([
    ["invalid JSON", new HttpResponse("not-json", { status: 200 })],
    ["schema mismatch", HttpResponse.json({ id: 123 })],
  ])("maps %s to INVALID_RESPONSE", async (_case, response) => {
    server.use(http.get("/api/http-client/invalid", () => response));

    await expect(
      apiRequest("/api/http-client/invalid", { schema: responseSchema }),
    ).rejects.toMatchObject({
      status: 200,
      code: "INVALID_RESPONSE",
      message: "서버 응답 형식이 올바르지 않습니다.",
    });
  });

  it("maps network failures to NETWORK_ERROR", async () => {
    server.use(
      http.get("/api/http-client/network", () => HttpResponse.error()),
    );

    await expect(
      apiRequest("/api/http-client/network", { schema: responseSchema }),
    ).rejects.toMatchObject({ status: 0, code: "NETWORK_ERROR" });
  });
});
