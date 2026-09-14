import { useState } from "react";
import { type Participant } from "@/features/chat/model/chat";
import { ConversationPanel } from "@/features/chat/components/ConversationPanel";
import { PageMetadata } from "@/shared/ui/page-metadata";
import { Select } from "@/shared/ui/select";

export function ChatPage() {
  const [author, setAuthor] = useState<Participant>("mina");
  return (
    <section className="grid min-w-0 gap-4">
      <PageMetadata
        title="메시징 / 채팅"
        description="팀과 나누는 대화, 한곳에서 이어가세요."
      />
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            메시징 / 채팅
          </h1>
          <p className="text-ink-subtle mt-2 text-xs sm:text-sm">
            팀과 나누는 대화, 한곳에서 이어가세요.
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs">
          <span className="text-ink-subtle sr-only sm:not-sr-only">참여자</span>
          <Select
            className="w-24"
            value={author}
            onChange={(event) => setAuthor(event.target.value as Participant)}
          >
            <option value="mina">민아</option>
            <option value="jun">준</option>
          </Select>
        </label>
      </header>
      {typeof BroadcastChannel === "undefined" && (
        <p role="alert">
          이 브라우저는 입력 중 실시간 표시를 지원하지 않습니다. 메시지는 다른
          탭의 저장소 변경으로 동기화합니다.
        </p>
      )}
      <ConversationPanel key={author} author={author} />
    </section>
  );
}
