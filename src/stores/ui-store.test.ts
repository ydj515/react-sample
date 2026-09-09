import { beforeEach, describe, expect, it } from "vitest";

import { useUiStore } from "./ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useUiStore.setState({
      density: "comfortable",
      theme: "light",
    });
  });

  it("theme과 density를 설정한다", () => {
    useUiStore.getState().setTheme("dark");
    useUiStore.getState().setDensity("compact");

    expect(useUiStore.getState().theme).toBe("dark");
    expect(useUiStore.getState().density).toBe("compact");
  });

  it("theme을 light와 dark 사이에서 toggle한다", () => {
    useUiStore.getState().toggleTheme();

    expect(useUiStore.getState().theme).toBe("dark");

    useUiStore.getState().toggleTheme();

    expect(useUiStore.getState().theme).toBe("light");
  });

  it("theme과 density 선호값만 localStorage에 저장한다", () => {
    useUiStore.getState().setTheme("dark");
    useUiStore.getState().setDensity("compact");

    const persistedValue = localStorage.getItem("react-sample-ui");

    expect(persistedValue).not.toBeNull();

    const persisted = JSON.parse(persistedValue!) as {
      state: Record<string, unknown>;
    };

    expect(persisted.state).toEqual({
      density: "compact",
      theme: "dark",
    });
    expect(persisted.state).not.toHaveProperty("sidebarOpen");
  });

  it("저장된 theme과 density를 기본값으로 초기화한다", () => {
    useUiStore.getState().setTheme("dark");
    useUiStore.getState().setDensity("compact");

    useUiStore.getState().resetSettings();

    expect(useUiStore.getState().theme).toBe("light");
    expect(useUiStore.getState().density).toBe("comfortable");

    const persistedValue = localStorage.getItem("react-sample-ui");
    const persisted = JSON.parse(persistedValue!) as {
      state: Record<string, unknown>;
    };

    expect(persisted.state).toEqual({
      density: "comfortable",
      theme: "light",
    });
  });
});
