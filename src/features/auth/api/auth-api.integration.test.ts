import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { signInRequest } from "./auth-api";
import { server } from "@/mocks/server";

describe("auth-api", () => {
  it("로그인 성공 응답을 검증해 반환한다", async () => {
    const response = await signInRequest({
      email: "demo@example.com",
      password: "password",
    });

    expect(response.user.email).toBe("demo@example.com");
    expect(response.token).toMatch(/^demo-token-/u);
  });

  it("런타임 스키마를 위반한 로그인 응답을 거부한다", async () => {
    server.use(
      http.post("/api/login", () =>
        HttpResponse.json({ token: "token-without-user" }),
      ),
    );

    await expect(
      signInRequest({ email: "demo@example.com", password: "password" }),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });
});
