import { useState } from "react";
import { MessagesSquare, Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

export function ConversationList({
  preview,
  onOpen,
}: {
  preview: string;
  onOpen: () => void;
}) {
  const [search, setSearch] = useState("");

  const match = `프로젝트 대화방 민아 준 ${preview}`.includes(search.trim());
  return (
    <aside
      className="border-line bg-surface flex h-full min-w-0 flex-col border-r"
      aria-label="대화 목록"
    >
      <div className="p-5">
        <h2 className="text-lg font-semibold">
          대화{" "}
          <span className="text-ink-subtle ml-1 text-sm font-normal">1</span>
        </h2>
        <label className="relative mt-4 block">
          <Search
            className="text-ink-subtle absolute top-3 left-3 size-4"
            aria-hidden
          />
          <Input
            aria-label="대화 검색"
            placeholder="대화 검색"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {match ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label="프로젝트 대화방 열기"
            aria-current="page"
            className="bg-brand-soft flex w-full items-start gap-3 rounded-xl p-3 text-left"
          >
            <span className="bg-surface text-brand grid size-11 shrink-0 place-items-center rounded-2xl">
              <MessagesSquare className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                프로젝트 대화방
              </span>
              <span className="text-ink-subtle mt-1 block truncate text-xs">
                {preview || "첫 메시지를 보내보세요"}
              </span>
              <span className="text-ink-subtle mt-2 block text-[11px]">
                민아 · 준
              </span>
            </span>
          </button>
        ) : (
          <p className="text-ink-subtle px-3 py-6 text-center text-sm">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
      <p className="border-line text-ink-subtle border-t p-4 text-xs leading-relaxed">
        프로젝트의 진행 상황과 아이디어를 함께 나누는 공간입니다.
      </p>
    </aside>
  );
}
