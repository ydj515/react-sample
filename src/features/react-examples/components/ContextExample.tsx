import { createContext, use } from "react";
import { Button } from "@/shared/ui/button";

const GuideContext = createContext("Context의 기본 설명입니다.");
function ConditionalGuide({ expanded }: { expanded: boolean }) {
  if (!expanded)
    return (
      <p className="text-ink-subtle text-sm">
        설명을 열면 Context 값을 읽습니다.
      </p>
    );
  const guide = use(GuideContext);
  return <p className="text-sm">{guide}</p>;
}
export function ContextExample({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <GuideContext value="use(Context)는 조건문 뒤에서도 가장 가까운 Provider의 값을 읽습니다.">
      <div className="grid gap-3">
        <Button variant="secondary" onClick={onToggle} aria-expanded={expanded}>
          Context 설명 {expanded ? "닫기" : "보기"}
        </Button>
        <ConditionalGuide expanded={expanded} />
      </div>
    </GuideContext>
  );
}
