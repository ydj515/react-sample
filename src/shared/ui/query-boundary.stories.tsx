import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { QueryBoundary } from "./query-boundary";

function Content({ load }: { load: () => Promise<string> }) {
  const { data } = useSuspenseQuery({ queryKey: ["example"], queryFn: load });
  return <p>{data}</p>;
}
function Demo({ mode }: { mode: "ready" | "pending" | "error" }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  const [load] = useState(() => {
    let attempts = 0;
    return async () => {
      if (mode === "pending") return new Promise<string>(() => {});
      if (mode === "error" && attempts++ === 0)
        throw new Error(
          "데이터를 불러오지 못했습니다. 다시 시도하면 복구합니다.",
        );
      return "서버 데이터를 불러왔습니다.";
    };
  });
  return (
    <QueryClientProvider client={client}>
      <div className="grid gap-6">
        <header>페이지 탐색 영역</header>
        <QueryBoundary>
          <Content load={load} />
        </QueryBoundary>
      </div>
    </QueryClientProvider>
  );
}
const meta = {
  title: "Shared/UI/QueryBoundary",
  component: Demo,
  tags: ["autodocs"],
  args: { mode: "ready" },
} satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Loading: Story = { args: { mode: "pending" } };
export const RetryError: Story = { args: { mode: "error" } };
