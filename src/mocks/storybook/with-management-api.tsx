import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { worker } from "@/mocks/browser";
import { resetManagementMockData } from "@/mocks/data/management";

let started: ReturnType<typeof worker.start> | undefined;
export async function loadManagementApi() {
  started ??= worker.start({ onUnhandledRequest: "bypass", quiet: true });
  await started;
  resetManagementMockData();
  return {};
}
function QueryStory({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
export const withManagementApi: Decorator = (Story, context) => (
  <QueryStory key={context.id}>
    <Story />
  </QueryStory>
);
