import { landingImages } from "../../model/images";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { rooms } from "../../model/experience";

export function StayRooms() {
  const [room, setRoom] = useState<keyof typeof rooms>("forest");
  const selected = rooms[room];
  return (
    <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
      <div className="relative">
        <img
          {...landingImages.room}
          sizes="(min-width: 1152px) 602px, (min-width: 1024px) calc((100vw - 104px) * 1.35 / 2.35), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
          alt="창 너머 소나무 숲이 보이는 차분한 우드 톤 침실 콘셉트"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute bottom-4 left-4 bg-black/50 px-3 py-2 text-xs text-white">
          공간 무드 이미지 · AI 생성 콘셉트
        </span>
      </div>
      <div>
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="객실 유형"
        >
          {(Object.keys(rooms) as (keyof typeof rooms)[]).map((value) => (
            <Button
              key={value}
              variant={room === value ? "primary" : "secondary"}
              aria-pressed={room === value}
              onClick={() => setRoom(value)}
            >
              {rooms[value].name}
            </Button>
          ))}
        </div>
        <div aria-live="polite">
          <p className="text-brand text-xs tracking-[0.2em]">
            ROOM / {room === "forest" ? "01" : "02"}
          </p>
          <h3 className="mt-4 font-serif text-4xl">{selected.name}</h3>
          <p className="text-ink-muted mt-5 leading-8">
            {selected.description}
          </p>
          <dl className="border-line my-7 space-y-4 border-y py-6 text-sm">
            <div className="flex justify-between">
              <dt>공간</dt>
              <dd>{selected.size}</dd>
            </div>
            <div className="flex justify-between">
              <dt>정원</dt>
              <dd>최대 {selected.capacity}인</dd>
            </div>
            <div>
              <dt className="text-ink-subtle mb-2">구성</dt>
              <dd>{selected.detail}</dd>
            </div>
          </dl>
          <p className="font-serif text-3xl">
            ₩{selected.price.toLocaleString("ko-KR")}
            <span className="text-ink-subtle ml-2 font-sans text-xs">
              / 1박 예시
            </span>
          </p>
        </div>
        <Button asChild variant="secondary" className="mt-7">
          <a href="#plan">
            일정과 객실 선택
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  );
}
