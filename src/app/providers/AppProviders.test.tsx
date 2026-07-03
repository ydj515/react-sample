import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AppProviders } from "@/app/providers/AppProviders";
import { useUiStore } from "@/stores/ui-store";

describe("AppProviders", () => {
  afterEach(() => {
    delete document.documentElement.dataset.density;
    delete document.documentElement.dataset.theme;
    useUiStore.setState({ density: "comfortable", theme: "light" });
  });

  it("포털 UI도 테마와 밀도 variant를 상속받도록 document 속성을 동기화한다", async () => {
    useUiStore.setState({ density: "compact", theme: "dark" });

    render(
      <AppProviders>
        <div>content</div>
      </AppProviders>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
    expect(document.documentElement).toHaveAttribute("data-density", "compact");
  });
});
