import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { dealStages, stageLabels } from "@/features/crm/model/crm-schema";
import type { Contact, Deal, DealStage } from "@/features/crm/model/crm-schema";
import { Select } from "@/shared/ui/select";
import { cn } from "@/shared/lib/cn";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

function Stage({
  stage,
  children,
  total,
}: {
  stage: DealStage;
  children: ReactNode;
  total: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <section
      ref={setNodeRef}
      aria-label={`${stageLabels[stage]} 단계`}
      className={cn(
        "bg-surface-muted min-w-0 rounded-xl border p-3",
        isOver ? "border-brand" : "border-line",
      )}
    >
      <h2 className="mb-3 font-semibold">{stageLabels[stage]}</h2>
      <p className="text-ink-subtle mb-4 text-xs">
        ₩{total.toLocaleString("ko-KR")}
      </p>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function DealCard({
  deal,
  contact,
  pending,
  onMove,
}: {
  deal: Deal;
  contact?: Contact;
  pending: boolean;
  onMove: (id: string, stage: DealStage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id, disabled: pending });
  return (
    <div
      ref={setNodeRef}
      className="bg-surface border-line min-w-0 space-y-3 rounded-lg border p-3"
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <button
        type="button"
        {...listeners}
        {...attributes}
        disabled={pending}
        aria-label={`${deal.title} 드래그 이동`}
        className="touch-none text-left text-sm font-semibold break-words"
      >
        {deal.title}
      </button>
      {contact && (
        <Link
          to="/crm/contacts/$contactId"
          params={{ contactId: contact.id }}
          className="text-brand block text-xs underline"
        >
          {contact.name}
        </Link>
      )}
      <p className="text-sm">₩{deal.amount.toLocaleString("ko-KR")}</p>
      <label className="grid gap-1 text-xs">
        딜 단계
        <Select
          aria-label={`${deal.title} 단계`}
          value={deal.stage}
          disabled={pending}
          onChange={(event) => onMove(deal.id, event.target.value as DealStage)}
        >
          {dealStages.map((stage) => (
            <option key={stage} value={stage}>
              {stageLabels[stage]}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

export function DealPipeline({
  deals,
  contacts,
  pending,
  onMove,
}: {
  deals: Deal[];
  contacts: Contact[];
  pending: boolean;
  onMove: (id: string, stage: DealStage) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ active, over }) => {
        if (over && dealStages.includes(over.id as DealStage)) {
          onMove(String(active.id), over.id as DealStage);
        }
      }}
    >
      <div
        aria-busy={pending}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
      >
        {dealStages.map((stage) => (
          <Stage
            key={stage}
            stage={stage}
            total={deals
              .filter((deal) => deal.stage === stage)
              .reduce((sum, deal) => sum + deal.amount, 0)}
          >
            {deals
              .filter((deal) => deal.stage === stage)
              .map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  contact={contacts.find(
                    (contact) => contact.id === deal.contactId,
                  )}
                  pending={pending}
                  onMove={onMove}
                />
              ))}
          </Stage>
        ))}
      </div>
    </DndContext>
  );
}
