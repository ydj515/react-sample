import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/shared/lib/test/render-with-providers";

function QueryClientProbe() {
  const queryClient = useQueryClient();
  const retry = queryClient.getDefaultOptions().queries?.retry;

  return <div>retry: {String(retry)}</div>;
}

describe("renderWithProviders", () => {
  it("QueryClientProvider를 포함해 컴포넌트를 렌더링한다", () => {
    renderWithProviders(<QueryClientProbe />);

    expect(screen.getByText("retry: false")).toBeInTheDocument();
  });

  it("rerender 중 같은 QueryClient를 유지한다", () => {
    const clients: QueryClient[] = [];

    function ClientCollector({ label }: { label: string }) {
      clients.push(useQueryClient());

      return <div>{label}</div>;
    }

    const { rerender } = renderWithProviders(<ClientCollector label="first" />);

    rerender(<ClientCollector label="second" />);

    expect(clients).toHaveLength(2);
    expect(clients[1]).toBe(clients[0]);
  });
});
