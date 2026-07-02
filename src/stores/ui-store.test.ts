import { beforeEach, describe, expect, it } from "vitest";

import { useUiStore } from "@/stores/ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({
      density: "comfortable",
      sidebarOpen: true,
      theme: "light",
    });
  });

  it("sidebar open 상태를 toggle한다", () => {
    useUiStore.getState().toggleSidebar();

    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });

  it("theme과 density를 설정한다", () => {
    useUiStore.getState().setTheme("dark");
    useUiStore.getState().setDensity("compact");

    expect(useUiStore.getState().theme).toBe("dark");
    expect(useUiStore.getState().density).toBe("compact");
  });
});
