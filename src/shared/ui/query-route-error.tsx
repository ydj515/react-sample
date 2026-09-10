import { PageMetadata } from "./page-metadata";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { QueryFeedback } from "./query-feedback";

export function QueryRouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const queryBoundary = useQueryErrorResetBoundary();
  return (
    <>
      <PageMetadata
        title="데이터를 불러오지 못했습니다"
        description="데이터 요청에 실패했습니다. 다시 시도해 주세요."
      />
      <QueryFeedback
        pending={false}
        error={error}
        onRetry={() => {
          queryBoundary.reset();
          reset();
          void router.invalidate();
        }}
      />
    </>
  );
}
