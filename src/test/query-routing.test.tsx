import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { useAuthStore } from "@/stores/auth-store";
import { server } from "@/mocks/server";
import { QueryPending } from "@/shared/ui/query-boundary";
import { QueryRouteError } from "@/shared/ui/query-route-error";
import { createTestQueryClient } from "@/shared/lib/test/test-query-client";

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      matches: false,
      media,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  useAuthStore.getState().signOut();
});

function renderUsers() {
  useAuthStore
    .getState()
    .signIn({ token: "test", user: { email: "demo@example.com" } });
  const client = createTestQueryClient();
  client.setDefaultOptions({ queries: { retry: false, staleTime: Infinity } });
  const router = createRouter({
    routeTree,
    context: { auth: useAuthStore, queryClient: client },
    history: createMemoryHistory({ initialEntries: ["/users"] }),
    defaultPendingComponent: QueryPending,
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
    defaultErrorComponent: QueryRouteError,
  });
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("route query loading", () => {
  it("recovers a loader failure without removing dashboard navigation", async () => {
    server.use(
      http.get("/api/users", () =>
        HttpResponse.json({ message: "Users unavailable" }, { status: 500 }),
      ),
    );
    renderUsers();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Users unavailable",
    );
    expect(
      screen.getByRole("navigation", { name: "주요 메뉴" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("데이터를 불러오지 못했습니다 | React Sample");
    server.resetHandlers();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "다시 시도" }));
    expect(
      await screen.findByRole("heading", { name: "사용자 관리" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(document.title).toBe("사용자 관리 | React Sample");
  });
  it("reuses the loader cache when the page suspense query mounts", async () => {
    let requests = 0;
    const count = ({ request }: { request: Request }) => {
      if (new URL(request.url).pathname === "/api/users") requests++;
    };
    server.events.on("request:start", count);
    try {
      renderUsers();
      expect(
        await screen.findByRole("heading", { name: "사용자 관리" }),
      ).toBeInTheDocument();
      expect(requests).toBe(1);
    } finally {
      server.events.removeListener("request:start", count);
    }
  });
});
