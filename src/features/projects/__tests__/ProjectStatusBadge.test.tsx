import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

describe("ProjectStatusBadge", () => {
  it("active 상태를 한국어 label로 보여준다", () => {
    renderWithProviders(<ProjectStatusBadge status="active" />);

    expect(screen.getByText("진행 중")).toBeInTheDocument();
  });
});
