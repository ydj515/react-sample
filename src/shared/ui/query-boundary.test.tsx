import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QueryBoundary } from "./query-boundary";

function Result({ load }: { load: () => Promise<string> }) {
  const { data } = useSuspenseQuery({
    queryKey: ["boundary-test"],
    queryFn: load,
  });
  return <p>{data}</p>;
}

describe("QueryBoundary", () => {
  it("keeps the surrounding layout visible while suspending and resolves content", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    let resolve!: (value: string) => void;
    const pending = new Promise<string>((done) => {
      resolve = done;
    });
    render(
      <QueryClientProvider client={client}>
        <header>Sample navigation</header>
        <QueryBoundary>
          <Result load={() => pending} />
        </QueryBoundary>
      </QueryClientProvider>,
    );
    expect(screen.getByText("Sample navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "데이터 로딩 중" }),
    ).toBeInTheDocument();
    resolve("Loaded content");
    expect(await screen.findByText("Loaded content")).toBeInTheDocument();
  });
  it("resets a failed query and recovers through the shared retry action", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    let failing = true;
    const load = async () => {
      if (failing) throw new Error("Unavailable");
      return "Recovered";
    };
    render(
      <QueryClientProvider client={client}>
        <QueryBoundary>
          <Result load={load} />
        </QueryBoundary>
      </QueryClientProvider>,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("Unavailable");
    failing = false;
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByText("Recovered")).toBeInTheDocument();
  });
});
