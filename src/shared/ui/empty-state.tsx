import { Button } from "./button";
import { Card } from "./card";

export function EmptyState({
  title,
  description = "검색어나 필터 조건을 확인해 주세요.",
  onReset,
  className,
}: {
  title: string;
  description?: string;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <Card role="status" className={`p-10 text-center ${className ?? ""}`}>
      <p className="font-medium">{title}</p>
      <p className="text-ink-subtle mt-2 text-sm">{description}</p>
      {onReset ? (
        <Button className="mt-4" variant="secondary" onClick={onReset}>
          필터 초기화
        </Button>
      ) : null}
    </Card>
  );
}
