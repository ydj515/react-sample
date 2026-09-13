import { useCallback } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { PageMetadata } from "@/shared/ui/page-metadata";
import { toast } from "@/stores/toast-store";
import {
  kanbanSearchSchema,
  type KanbanColumnId,
} from "@/features/kanban/model/kanban-schema";
import {
  useKanbanBoardQuery,
  useMoveKanbanCardMutation,
} from "@/features/kanban/queries/kanban-queries";
import { KanbanBoardView } from "@/features/kanban/components/KanbanBoard";
import { KanbanFilters } from "@/features/kanban/components/KanbanFilters";

function KanbanPageContent() {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;

  const search = kanbanSearchSchema.parse(rawSearch);

  const navigate = useNavigate();

  const boardQuery = useKanbanBoardQuery();

  const move = useMoveKanbanCardMutation();

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: "/kanban",
        search: { ...search, ...patch },
        replace: true,
      });
    },
    [navigate, search],
  );

  const handleMove = useCallback(
    (input: {
      cardId: string;
      toColumnId: KanbanColumnId;
      toIndex: number;
    }) => {
      move.mutate(input, {
        onSuccess: () => {
          toast.success("카드 위치를 저장했습니다.");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "카드 이동에 실패했습니다. 이전 위치로 되돌렸습니다.",
          );
        },
      });
    },
    [move],
  );
  return (
    <section className="grid min-w-0 gap-6">
      <PageMetadata
        title="칸반 보드"
        description="드래그&드롭과 옵티미스틱 업데이트로 작업 흐름을 시각적으로 관리하세요."
      />
      <PageHeader
        title="칸반 보드"
        description="4개의 컬럼과 드래그&드롭, 옵티미스틱 이동/롤백, URL 필터를 함께 보여주는 작업 흐름 예제입니다."
        actions={
          <Link
            to="/operations"
            className="text-brand text-sm font-medium hover:underline"
          >
            운영 화면에서 진행률 보기 →
          </Link>
        }
      />
      {boardQuery.error ? (
        <Card role="alert" className="border-negative/30 p-4 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <AlertTriangle className="size-4" aria-hidden /> 보드를 불러오지
            못했습니다.
          </p>
          <p className="text-ink-subtle mt-1 text-xs">
            잠시 후 새로고침하거나 페이지를 다시 열어 주세요.
          </p>
        </Card>
      ) : null}
      {boardQuery.data ? (
        <>
          <KanbanFilters
            search={search}
            cards={boardQuery.data.cards}
            onChange={updateSearch}
            onReset={() => updateSearch(kanbanSearchSchema.parse({}))}
          />
          <KanbanBoardView
            board={boardQuery.data}
            search={search}
            isPending={move.isPending}
            pendingCardId={
              move.isPending && move.variables ? move.variables.cardId : null
            }
            onMove={handleMove}
          />
        </>
      ) : (
        <Card className="p-6 text-sm">보드를 불러오는 중입니다.</Card>
      )}
    </section>
  );
}

export function KanbanPage() {
  return <KanbanPageContent />;
}
