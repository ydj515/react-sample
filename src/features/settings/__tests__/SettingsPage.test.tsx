import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";
import { useUiStore } from "@/stores/ui-store";

describe("SettingsPage", () => {
  beforeEach(() => {
    useUiStore.setState({
      density: "comfortable",
      sidebarOpen: true,
      theme: "light",
    });
  });

  it("밀도 선택을 Zustand UI 상태에 반영한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SettingsPage />);

    await user.selectOptions(screen.getByLabelText("밀도"), "compact");

    expect(useUiStore.getState().density).toBe("compact");
  });

  it("선택한 밀도가 어떤 UI 간격을 바꾸는지 설명한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SettingsPage />);

    expect(
      screen.getByText(/이 설정은 브라우저에 저장됩니다/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Comfortable은 페이지와 카드 여백을 넓게 유지합니다/),
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("밀도"), "compact");

    expect(
      screen.getByText(/Compact는 사이드바, 헤더, 본문 여백을 줄입니다/),
    ).toBeInTheDocument();
  });

  it("테마 설정은 헤더 토글로 이동해 설정 폼에 렌더링하지 않는다", () => {
    renderWithProviders(<SettingsPage />);

    expect(screen.queryByLabelText("테마")).not.toBeInTheDocument();
  });

  it("설정 초기화 버튼으로 저장형 UI 설정을 기본값으로 되돌린다", async () => {
    const user = userEvent.setup();

    useUiStore.setState({
      density: "compact",
      theme: "dark",
    });

    renderWithProviders(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "설정 초기화" }));

    expect(useUiStore.getState().density).toBe("comfortable");
    expect(useUiStore.getState().theme).toBe("light");
    expect(screen.getByLabelText("밀도")).toHaveValue("comfortable");
  });
});
