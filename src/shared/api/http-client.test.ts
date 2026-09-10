import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { env } from "@/shared/config/env";
import { server } from "@/mocks/server";
import { ApiError } from "./api-error";
import { apiRequest } from "./http-client";

vi.mock("@/shared/config/env", () => ({
  env: { VITE_API_BASE_URL: "http://localhost:3000", VITE_ENABLE_MOCKS: true },
}));

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

  it("uses the fallback message when the error body message is empty", async () => {
    server.use(
      http.get("/api/http-client/empty-message", () =>
        HttpResponse.json({ code: "FAILED", message: "" }, { status: 500 }),
      ),
    );

    await expect(
      apiRequest("/api/http-client/empty-message", {
        schema: responseSchema,
        fallbackErrorMessage: "요청에 실패했습니다.",
      }),
    ).rejects.toMatchObject({ message: "요청에 실패했습니다." });
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

afterEach(() => {
  env.VITE_ENABLE_MOCKS = true;
  env.VITE_API_BASE_URL = "http://localhost:3000";
});

it.each([
  "https://api.example.test/backend",
  "https://api.example.test/backend/",
])("routes real requests through the configured base %s", async (base) => {
  env.VITE_ENABLE_MOCKS = false;
  env.VITE_API_BASE_URL = base;
  server.use(
    http.post(
      "https://api.example.test/backend/api/http-client/real",
      async ({ request }) => {
        expect(new URL(request.url).searchParams.get("q")).toBe("한글");
        expect(request.headers.get("X-Sample")).toBe("test");
        expect(await request.json()).toEqual({ name: "sample" });
        return HttpResponse.json({ id: "real-server" });
      },
    ),
  );
  await expect(
    apiRequest("/api/http-client/real?q=%ED%95%9C%EA%B8%80", {
      schema: responseSchema,
      method: "POST",
      headers: { "X-Sample": "test" },
      body: JSON.stringify({ name: "sample" }),
    }),
  ).resolves.toEqual({ id: "real-server" });
});

it("uses localhost:3000 when real API mode has no custom base", async () => {
  env.VITE_ENABLE_MOCKS = false;
  server.use(
    http.get("http://localhost:3000/api/http-client/default", () =>
      HttpResponse.json({ id: "default-server" }),
    ),
  );
  await expect(
    apiRequest("/api/http-client/default", { schema: responseSchema }),
  ).resolves.toEqual({ id: "default-server" });
});

it.each(["string", "URL", "Request"])(
  "preserves explicit %s targets",
  async (kind) => {
    env.VITE_ENABLE_MOCKS = false;
    const url = "https://explicit.example.test/api/resource";
    server.use(http.get(url, () => HttpResponse.json({ id: "explicit" })));
    const input =
      kind === "URL"
        ? new URL(url)
        : kind === "Request"
          ? new Request(url)
          : url;
    await expect(
      apiRequest(input, { schema: responseSchema }),
    ).resolves.toEqual({ id: "explicit" });
  },
);
