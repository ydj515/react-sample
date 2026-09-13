export function KanbanDropIndicator({ height }: { height: number }) {
  return (
    <div
      aria-hidden="true"
      data-testid="kanban-drop-placeholder"
      style={{ height }}
      className="bg-brand-soft/40 border-brand/25 rounded-control pointer-events-none border"
    />
  );
}
