import { QueryClient } from "@tanstack/react-query";

// Router loaders and React consumers must use the same server-state cache.
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});
