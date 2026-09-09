import { Play, X, Code2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/dialog";

export function CoursePreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="bg-ink text-surface dark:bg-canvas dark:text-ink group rounded-panel focus-visible:outline-brand relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden p-6 focus-visible:outline-2"
          aria-label="강의 미리보기 열기"
        >
          <span className="absolute top-5 left-5 text-xs tracking-widest opacity-70">
            MASTERCLASS / CHAPTER 01
          </span>
          <Code2 className="mb-4 size-12 text-indigo-300" aria-hidden />
          <span className="text-xl font-semibold sm:text-2xl">
            컴포넌트, 조립 가능한 생각
          </span>
          <span className="mt-5 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs">
            <Play className="size-4" aria-hidden />첫 번째 수업 미리보기
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-xl font-bold">
            01. 컴포넌트, 조립 가능한 생각
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="미리보기 닫기">
              <X aria-hidden />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="text-ink-muted mt-3 text-sm">
          영상 대신 읽고 체험하는 공개 샘플 수업입니다.
        </DialogDescription>
        <div className="mt-6 space-y-5 text-sm leading-7">
          <p>
            컴포넌트를 나누는 기준은 화면의 크기보다 책임입니다. 반복되는 모양과
            함께 바뀌는 동작을 먼저 찾아보세요.
          </p>
          <pre className="bg-surface-muted rounded-control overflow-x-auto p-5 text-xs">
            <code>
              {
                "<Card>\n  <CardTitle>작은 단위부터</CardTitle>\n  <Button>함께 조합하기</Button>\n</Card>"
              }
            </code>
          </pre>
          <h3 className="font-bold">생각해 볼 질문</h3>
          <p>
            버튼의 색상이 바뀌면 모든 카드가 바뀌어야 할까요? 공통 UI와 페이지의
            책임을 구분해 보세요.
          </p>
          <p className="bg-brand-soft text-brand rounded-control p-4">
            실습: 동일한 Button을 사용해 카드 두 개를 서로 다른 순서로 구성해
            보세요.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
