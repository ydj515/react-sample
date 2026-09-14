import { useState } from "react";
import { ArrowLeft, MessagesSquare } from "lucide-react";
import { participantNames, type Participant } from "@/features/chat/model/chat";
import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatComposer } from "./ChatComposer";
import { MessageList } from "./MessageList";
import { ConversationList } from "./ConversationList";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/ui/dialog";

export function ConversationPanel({ author }: { author: Participant }) {
  const chat = useChat(author);

  const [fail, setFail] = useState(false);

  const [listOpen, setListOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const preview = chat.pending.at(-1)?.text ?? chat.messages.at(-1)?.text ?? "";
  return (
    <div className="border-line bg-surface grid h-[calc(100dvh-18rem)] max-h-[900px] min-h-[300px] min-w-0 overflow-hidden rounded-2xl border shadow-sm md:grid-cols-[240px_minmax(0,1fr)] lg:h-[calc(100dvh-16rem)] xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="hidden min-h-0 md:block">
        <ConversationList preview={preview} onOpen={() => {}} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-col">
        <header className="border-line flex shrink-0 items-center justify-between gap-3 border-b px-3 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              aria-label="대화 목록 열기"
              onClick={() => setListOpen(true)}
            >
              <ArrowLeft className="size-4" aria-hidden />
            </Button>
            <span className="bg-brand-soft text-brand hidden size-10 shrink-0 place-items-center rounded-2xl sm:grid">
              <MessagesSquare className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">
                프로젝트 대화방
              </h2>
              <p className="text-ink-subtle mt-1 text-xs">
                민아 · 준 <span className="mx-1">·</span> 참여자 2명
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSettingsOpen(true)}
          >
            데모 설정
          </Button>
        </header>
        {chat.error && (
          <p role="alert" className="text-negative px-4 py-2 text-sm">
            {chat.error}
          </p>
        )}
        <MessageList
          messages={chat.messages}
          pending={chat.pending}
          author={author}
          receipts={chat.receipts}
          hasMore={chat.hasMore}
          onMore={chat.loadMore}
          onRetry={chat.retry}
          onRead={chat.markRead}
        />
        <p
          role="status"
          className="text-ink-subtle bg-surface-muted/70 h-6 shrink-0 px-5 text-xs"
        >
          {chat.typing
            ? `${participantNames[author === "mina" ? "jun" : "mina"]}님이 입력 중…`
            : ""}
        </p>
        <ChatComposer
          disabled={chat.blocked}
          onTyping={chat.notifyTyping}
          onSend={(text) => {
            chat.send(text, fail);
            setFail(false);
          }}
        />
      </div>
      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="flex h-[70dvh] max-w-sm flex-col overflow-hidden p-0">
          <DialogTitle className="sr-only">대화 목록</DialogTitle>
          <DialogDescription className="sr-only">
            대화를 선택하면 대화방으로 돌아갑니다.
          </DialogDescription>
          <ConversationList
            preview={preview}
            onOpen={() => setListOpen(false)}
          />
          <DialogClose asChild>
            <Button variant="secondary" className="m-3">
              닫기
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            채팅 데모 설정
          </DialogTitle>
          <DialogDescription className="text-ink-subtle mt-3 text-sm leading-relaxed">
            같은 브라우저에서 두 탭을 열고 서로 다른 참여자를 선택하세요. 외부
            서버 없이 대화·읽음·입력 중 상태가 동기화됩니다.
          </DialogDescription>
          <label className="my-5 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={fail}
              onChange={(event) => setFail(event.target.checked)}
            />
            다음 전송 실패 체험
          </label>
          <p className="text-ink-subtle mb-5 text-xs">
            실패한 메시지는 대화창에서 재시도할 수 있습니다.
          </p>
          <DialogClose asChild>
            <Button className="w-full">설정 완료</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
