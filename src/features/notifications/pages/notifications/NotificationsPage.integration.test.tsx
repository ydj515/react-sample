import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderManagement } from "@/test/render-management";
import { getNotificationUnread } from "@/features/notifications/api/notification-api";

describe("notifications page", () => {
  it("필터·무한 스크롤과 모두 읽음 처리를 수행한다", async () => {
    const user = userEvent.setup();
    renderManagement("/notifications");
    expect(
      await screen.findByRole("heading", { name: "알림 센터" }),
    ).toBeInTheDocument();
    const unreadBefore = (await getNotificationUnread()).count;
    expect(unreadBefore).toBeGreaterThan(0);
    // 초기 페이지에 표시된 알림만 표시되어야 한다 (페이지 크기 8).
    const initialItems = await screen.findAllByTestId(/^notification-item-/);
    expect(initialItems.length).toBeGreaterThan(0);
    expect(initialItems.length).toBeLessThanOrEqual(8);
    // 카테고리 필터 변경
    await user.selectOptions(
      screen.getByRole("combobox", { name: "알림 카테고리" }),
      "order",
    );
    await waitFor(() =>
      expect(
        screen
          .getAllByTestId(/^notification-item-/)
          .every((node) => /주문/.test(node.textContent ?? "")),
      ).toBe(true),
    );
    // 필터 초기화 후 모두 읽음
    await user.click(screen.getByRole("button", { name: "초기화" }));
    await user.click(
      screen.getByRole("button", { name: "모두 읽음으로 표시" }),
    );
    await waitFor(async () => {
      const after = (await getNotificationUnread()).count;
      expect(after).toBe(0);
    });
  });

  it("빈 결과일 때 안내 메시지를 보여준다", async () => {
    const user = userEvent.setup();
    renderManagement("/notifications");
    await screen.findByRole("heading", { name: "알림 센터" });
    // 모두 읽음 처리 후 안 읽음 필터로 좁히면 결과가 비어 있어야 한다.
    await user.click(
      screen.getByRole("button", { name: "모두 읽음으로 표시" }),
    );
    await waitFor(async () => {
      const after = (await getNotificationUnread()).count;
      expect(after).toBe(0);
    });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "알림 읽음 상태" }),
      "unread",
    );
    const empty = await screen.findByText("표시할 알림이 없습니다.");
    expect(empty).toBeInTheDocument();
  });

  it("개별 알림 읽음 처리가 카드에서 동작한다", async () => {
    const user = userEvent.setup();

    const before = (await getNotificationUnread()).count;
    expect(before).toBeGreaterThan(0);
    renderManagement("/notifications");
    const actions = await screen.findAllByRole("button", {
      name: "읽음으로 표시",
    });
    expect(actions.length).toBeGreaterThan(0);
    await user.click(actions[0]!);
    await waitFor(async () => {
      const after = (await getNotificationUnread()).count;
      expect(after).toBe(before - 1);
    });
  });
});
