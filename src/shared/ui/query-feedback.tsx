import { Button } from "./button";
import { Card } from "./card";
import { Skeleton } from "./skeleton";

export function QueryFeedback({
  pending,
  error,
  onRetry,
  errorMessage,
  pendingLabel = "데이터 로딩 중",
  retrying = false,
}: {
  pending: boolean;
  error: unknown;
  onRetry: () => void;
  errorMessage?: string;
  pendingLabel?: string;
  retrying?: boolean;
}) {
  if (pending) {
    return (
      <div role="status" aria-label={pendingLabel} className="grid gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (error) {
    return (
      <Card role="alert" className="p-6">
        <p className="text-negative text-sm">
          {errorMessage ??
            (error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.")}
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          disabled={retrying}
          onClick={onRetry}
        >
          다시 시도
        </Button>
      </Card>
    );
  }
  return null;
}
