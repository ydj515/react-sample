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

  it("테마와 밀도 선택을 Zustand UI 상태에 반영한다", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SettingsPage />);

    await user.selectOptions(screen.getByLabelText("테마"), "dark");
    await user.selectOptions(screen.getByLabelText("밀도"), "compact");

    expect(useUiStore.getState().theme).toBe("dark");
    expect(useUiStore.getState().density).toBe("compact");
  });
});
