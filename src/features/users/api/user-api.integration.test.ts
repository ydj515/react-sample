import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { describe, expect, it } from "vitest";
import { getUsers, getUser, updateUserAccess } from "./user-api";

describe("user management API", () => {
  it("역할과 상태 변경을 상세와 목록에 반영한다", async () => {
    const user = (await getUsers())[0]!;
    const updated = await updateUserAccess(user.id, {
      role: "viewer",
      status: "suspended",
    });
    expect(updated.activity[0]?.text).toContain("조회 전용");
    expect(await getUser(user.id)).toMatchObject({
      role: "viewer",
      status: "suspended",
    });
    expect((await getUsers()).find((item) => item.id === user.id)?.status).toBe(
      "suspended",
    );
  });
  it("없는 사용자에 대해 404 오류를 반환한다", async () => {
    await expect(getUser("missing")).rejects.toMatchObject({
      status: 404,
      code: "USER_NOT_FOUND",
    });
  });
});

it("성공 응답의 스키마가 잘못되면 INVALID_RESPONSE로 거부한다", async () => {
  server.use(
    http.get("/api/users", () => HttpResponse.json([{ id: "invalid" }])),
  );
  await expect(getUsers()).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
});

it("동일한 역할과 상태를 저장해도 활동 이력이 중복되지 않는다", async () => {
  const user = await getUser("user-1");
  const updated = await updateUserAccess(user.id, {
    role: user.role,
    status: user.status,
  });
  expect(updated.activity).toEqual(user.activity);
});

it.each([
  ["reviews", "상품 리뷰 작성"],
  ["coupons", "쿠폰 사용"],
  ["email", "이메일 수신"],
  ["sms", "SMS 수신"],
  ["adminPanel", "관리자 패널 접근"],
] as const)(
  "%s 권한만 바꾸면 실제 변경 내역을 기록한다",
  async (key, label) => {
    const user = await getUser("user-1");
    const enabled = !user.permissions[key];
    const updated = await updateUserAccess(user.id, {
      role: user.role,
      status: user.status,
      permissions: { ...user.permissions, [key]: enabled },
    });
    expect(updated.activity).toHaveLength(user.activity.length + 1);
    expect(updated.activity[0]?.text).toContain(
      `${label}: ${enabled ? "비활성 → 활성" : "활성 → 비활성"}`,
    );
    expect(updated.activity[0]?.text).not.toContain(
      "관리자 · 활성 → 관리자 · 활성",
    );
    expect((await getUser(user.id)).permissions[key]).toBe(enabled);
  },
);

it("역할과 상태 및 여러 권한 변경을 하나의 활동에 기록한다", async () => {
  const user = await getUser("user-1");
  const updated = await updateUserAccess(user.id, {
    role: "viewer",
    status: "suspended",
    permissions: { ...user.permissions, reviews: false, email: true },
  });
  expect(updated.activity).toHaveLength(user.activity.length + 1);
  expect(updated.activity[0]?.text).toContain(
    "관리자 · 활성 → 조회 전용 · 이용 중지",
  );
  expect(updated.activity[0]?.text).toContain("상품 리뷰 작성: 활성 → 비활성");
  expect(updated.activity[0]?.text).toContain("이메일 수신: 비활성 → 활성");
  expect(updated.activity[0]?.text).not.toContain("쿠폰 사용");
});

it("동일한 세부 권한을 다시 저장해도 활동 이력을 만들지 않는다", async () => {
  const user = await getUser("user-1");
  const updated = await updateUserAccess(user.id, {
    role: user.role,
    status: user.status,
    permissions: { ...user.permissions },
  });
  expect(updated.activity).toEqual(user.activity);
});
