import { useState } from "react";
import {
  eventsSchema,
  conflicts,
  moveEvent,
  navigateDate,
  newEventInput,
  seoulToday,
  type CalendarEvent,
  type CalendarView,
  type EventInput,
} from "@/features/calendar/model/calendar";
import { CalendarGrid } from "@/features/calendar/components/CalendarGrid";
import { CalendarToolbar } from "@/features/calendar/components/CalendarToolbar";
import { EventForm } from "@/features/calendar/components/EventForm";
import { useLocalRecords } from "@/shared/lib/use-local-records";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/ui/dialog";

const initialEvents = (): CalendarEvent[] => [];

export function CalendarPage() {
  const store = useLocalRecords(
    "react-sample-calendar-v1",
    eventsSchema,
    initialEvents,
  );

  const [date, setDate] = useState(seoulToday);

  const [view, setView] = useState<CalendarView>("month");

  const [editing, setEditing] = useState<(EventInput & { id?: string }) | null>(
    null,
  );

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  function save(input: EventInput, id?: string) {
    const candidate = { ...input, id: id ?? crypto.randomUUID() };

    const overlapping = conflicts(candidate, store.data);
    if (overlapping.length) {
      setError(
        `시간이 겹치는 일정: ${overlapping.map((event) => event.title).join(", ")}`,
      );
      return;
    }
    if (
      store.save(
        id
          ? store.data.map((event) => (event.id === id ? candidate : event))
          : [...store.data, candidate],
      )
    ) {
      setEditing(null);
      setError("");
      setMessage("일정을 저장했습니다.");
      setDate(candidate.start.slice(0, 10));
    }
  }

  function create(day: string, time?: string) {
    setError("");
    setEditing(newEventInput(day, time));
  }
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="캘린더 / 일정"
        description="팀의 일정을 한눈에 확인하고 관리하세요."
        actions={
          <Button disabled={store.blocked} onClick={() => create(date)}>
            일정 추가
          </Button>
        }
      />
      {store.error && (
        <p role="alert" className="text-negative">
          {store.error}
        </p>
      )}
      {!editing && error && (
        <p role="alert" className="text-negative">
          {error}
        </p>
      )}
      <p role="status" className="sr-only">
        {message}
      </p>
      <div className="border-line bg-surface grid min-w-0 gap-5 rounded-2xl border p-3 sm:p-5">
        <CalendarToolbar
          date={date}
          view={view}
          onDate={setDate}
          onView={setView}
          onNavigate={(direction) =>
            setDate(navigateDate(date, view, direction))
          }
          onToday={() => setDate(seoulToday())}
        />
        <CalendarGrid
          date={date}
          view={view}
          events={store.data}
          onCreate={create}
          onEdit={(event) => {
            setError("");
            setEditing(event);
          }}
          onMove={(event, start) => save(moveEvent(event, start), event.id)}
        />
        <div className="text-ink-subtle flex flex-wrap justify-between gap-2 text-xs">
          <span>서울 시간 · 일요일 시작 · 브라우저에 자동 저장</span>
          <span>
            날짜를 눌러 추가 · 손잡이로 이동 · 겹치는 일정은 저장되지 않습니다
          </span>
        </div>
      </div>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-semibold">
            {editing?.id ? "일정 수정" : "새 일정"}
          </DialogTitle>
          <DialogDescription className="text-ink-subtle my-3 text-sm">
            시작과 종료 시간을 입력하세요. 인접한 일정은 허용하며 시간이 겹치는
            일정은 차단합니다.
          </DialogDescription>
          {editing && (
            <EventForm
              value={editing}
              error={error || store.error}
              onSave={(input) => save(input, editing.id)}
              onDelete={
                editing.id
                  ? () => {
                      if (
                        store.save(
                          store.data.filter((event) => event.id !== editing.id),
                        )
                      ) {
                        setEditing(null);
                        setMessage("일정을 삭제했습니다.");
                      }
                    }
                  : undefined
              }
            />
          )}
          <DialogClose asChild>
            <Button className="mt-4 w-full" variant="secondary">
              닫기
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}
