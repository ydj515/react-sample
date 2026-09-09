import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { QueryFeedback } from "./query-feedback";

export function QueryRouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const queryBoundary = useQueryErrorResetBoundary();
  return (
    <QueryFeedback
      pending={false}
      error={error}
      onRetry={() => {
        queryBoundary.reset();
        reset();
        void router.invalidate();
      }}
    />
  );
}
