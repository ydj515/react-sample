import { useUrlSearch } from "@/shared/lib/use-url-search";
import { eventSearchSchema } from "@/features/landing/model/search";
import { useState } from "react";
import { Bookmark, Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

const sessions = [
  {
    id: "e1",
    day: "1",
    time: "10:00",
    track: "Design",
    title: "좋은 질문이 제품을 바꾼다",
    speaker: "정하나 · Product Designer",
    duration: "40 MIN",
  },
  {
    id: "e2",
    day: "1",
    time: "11:00",
    track: "Engineering",
    title: "디자인 시스템, 코드로 이어가기",
    speaker: "윤지후 · Frontend Engineer",
    duration: "50 MIN",
  },
  {
    id: "e3",
    day: "1",
    time: "14:00",
    track: "Culture",
    title: "작은 팀이 함께 만드는 방식",
    speaker: "이로운 · Studio Founder",
    duration: "40 MIN",
  },
  {
    id: "e4",
    day: "2",
    time: "10:00",
    track: "Design",
    title: "화면 밖의 경험을 설계하다",
    speaker: "박다인 · Experience Designer",
    duration: "40 MIN",
  },
  {
    id: "e5",
    day: "2",
    time: "11:00",
    track: "Engineering",
    title: "접근성은 모두의 기본값",
    speaker: "김도경 · UI Engineer",
    duration: "50 MIN",
  },
];
export function EventSchedule() {
  const [{ day: selectedDay, track }, change] = useUrlSearch(eventSearchSchema);
  const day = String(selectedDay);
  const setDay = (day: "1" | "2") => change({ day: day === "1" ? 1 : 2 });
  const setTrack = (track: "전체" | "Design" | "Engineering" | "Culture") =>
    change({ track });
  const [saved, setSaved] = useState<string[]>([]);
  const visible = sessions.filter(
    (session) =>
      session.day === day && (track === "전체" || session.track === track),
  );
  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
        <div role="group" aria-label="행사 날짜" className="flex gap-2">
          {(["1", "2"] as const).map((value) => (
            <Button
              key={value}
              variant={day === value ? "primary" : "secondary"}
              aria-pressed={day === value}
              onClick={() => setDay(value)}
            >
              DAY {value} · 11.{value === "1" ? "12" : "13"}
            </Button>
          ))}
        </div>
        <div
          role="group"
          aria-label="세션 트랙"
          className="flex flex-wrap gap-2"
        >
          {(["전체", "Design", "Engineering", "Culture"] as const).map(
            (value) => (
              <Button
                key={value}
                size="sm"
                variant={track === value ? "primary" : "ghost"}
                aria-pressed={track === value}
                onClick={() => setTrack(value)}
              >
                {value}
              </Button>
            ),
          )}
        </div>
      </div>
      <p role="status" className="text-ink-subtle my-5 text-xs">
        {visible.length}개 세션 · 관심 세션 {saved.length}개
      </p>
      <div className="border-line divide-line divide-y border-y">
        {visible.map((session) => (
          <article
            key={session.id}
            className="grid gap-4 py-7 sm:grid-cols-[100px_1fr_auto]"
          >
            <p className="text-ink-subtle font-mono text-xl">{session.time}</p>
            <div>
              <div className="text-brand flex gap-4 font-mono text-[10px] tracking-widest">
                <span>{session.track.toUpperCase()}</span>
                <span>{session.duration}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                {session.title}
              </h3>
              <p className="text-ink-muted mt-2 text-sm">{session.speaker}</p>
            </div>
            <Button
              variant="secondary"
              className="self-center justify-self-start"
              aria-label={`${session.title} 관심 세션`}
              aria-pressed={saved.includes(session.id)}
              onClick={() =>
                setSaved((previous) =>
                  previous.includes(session.id)
                    ? previous.filter((id) => id !== session.id)
                    : [...previous, session.id],
                )
              }
            >
              {saved.includes(session.id) ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Bookmark className="size-4" aria-hidden />
              )}
              관심
            </Button>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="bg-surface-muted p-8 text-center">
          <p className="mb-4 text-sm">
            선택한 날짜에 해당 트랙의 세션이 없습니다.
          </p>
          <Button variant="secondary" onClick={() => setTrack("전체")}>
            모든 트랙 보기
            <ArrowUpRight className="size-4" aria-hidden />
          </Button>
        </div>
      )}
    </>
  );
}
