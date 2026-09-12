import type { ManagedOrder } from "@/features/orders/model/order-schema";
import { Card } from "@/shared/ui/card";
import { OrderNoteForm } from "@/features/orders/components/OrderActions";

export function OrderNotes({ order }: { order: ManagedOrder }) {
  return (
    <Card className="grid gap-5 p-5">
      <h2 className="text-sm font-semibold">관리자 메모</h2>
      <OrderNoteForm orderId={order.id} />
      {order.notes.length ? (
        <ul className="grid gap-3">
          {order.notes.map((note) => (
            <li key={note.id} className="rounded-control bg-surface-muted p-4">
              <p className="text-sm break-words whitespace-pre-wrap">
                {note.text}
              </p>
              <p className="text-ink-subtle mt-2 text-xs">
                {note.author} · {new Date(note.at).toLocaleString("ko-KR")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-subtle text-sm">아직 등록된 메모가 없습니다.</p>
      )}
    </Card>
  );
}
