import { useState } from "react";
import type { Project } from "@/features/projects/model";
import { PageHeader } from "@/shared/ui/page-header";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { DeferredProjects } from "@/features/react-examples/components/DeferredProjects";
import { ContextExample } from "@/features/react-examples/components/ContextExample";
import { MeasuredPanel } from "@/features/react-examples/components/MeasuredPanel";

export function ReactExamplesPage({
  projectsPromise,
  requestId,
  onRefresh,
  refreshing = false,
}: {
  projectsPromise: Promise<Project[]>;
  requestId: string;
  onRefresh: () => void;
  refreshing?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [measuring, setMeasuring] = useState(true);
  return (
    <section className="grid gap-6">
      <PageHeader
        title="React 19 예제"
        description="조건부 데이터 읽기, Context와 DOM 정리를 직접 확인하세요."
      />
      <Card className="grid gap-4 p-6">
        <h2 className="font-semibold">지연 데이터 읽기</h2>
        <p className="text-ink-subtle text-sm">
          본문은 먼저 표시하고 프로젝트 데이터는 별도로 기다립니다. 이 예제는
          로드 시점의 스냅샷이며, 최신 데이터는 새로고침으로 가져옵니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setVisible((value) => !value)}
            aria-expanded={visible}
          >
            프로젝트 데이터 {visible ? "숨기기" : "보기"}
          </Button>
          <Button variant="secondary" onClick={onRefresh} disabled={refreshing}>
            데이터 새로고침
          </Button>
        </div>
        <QueryBoundary key={requestId} onRetry={onRefresh}>
          <DeferredProjects
            visible={visible}
            projectsPromise={projectsPromise}
          />
        </QueryBoundary>
      </Card>
      <Card className="grid gap-4 p-6">
        <h2 className="font-semibold">조건부 Context</h2>
        <ContextExample
          expanded={expanded}
          onToggle={() => setExpanded((value) => !value)}
        />
      </Card>
      <Card className="grid gap-4 p-6">
        <h2 className="font-semibold">ref 정리 함수</h2>
        <Button
          variant="secondary"
          onClick={() => setMeasuring((value) => !value)}
        >
          측정 패널 {measuring ? "제거" : "추가"}
        </Button>
        {measuring && <MeasuredPanel />}
      </Card>
    </section>
  );
}
