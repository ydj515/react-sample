import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function AppFooter() {
  return (
    <footer className="border-line bg-surface text-ink-subtle mt-auto flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4 text-xs">
      <p>ProjectHub · React Sample © {new Date().getFullYear()}</p>
      <nav aria-label="푸터 링크" className="flex items-center gap-5">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="hover:text-brand focus-visible:outline-brand py-1 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              도움말
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-lg font-semibold">
              ProjectHub 도움말
            </DialogTitle>
            <DialogDescription className="text-ink-subtle mt-2 text-sm">
              대시보드와 프로젝트 화면을 빠르게 사용하는 방법입니다.
            </DialogDescription>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold">메뉴 검색</dt>
                <dd className="text-ink-muted mt-1">
                  상단 검색 또는 Ctrl / ⌘ + K로 화면을 찾고, 방향키와 Enter로
                  이동합니다.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">대시보드와 주문</dt>
                <dd className="text-ink-muted mt-1">
                  차트를 선택하면 수치를 확인할 수 있습니다. 주문 검색 조건을
                  적용하고 결과를 CSV로 내려받으세요.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">화면 설정</dt>
                <dd className="text-ink-muted mt-1">
                  상단 아이콘으로 테마를 바꾸고, 설정에서 화면 밀도를 조절할 수
                  있습니다.
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button>닫기</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        <a
          href="https://github.com/ydj515/react-sample"
          target="_blank"
          rel="noreferrer"
          className="hover:text-brand focus-visible:outline-brand py-1 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          소스코드<span className="sr-only"> (새 탭)</span>
        </a>
        <Link
          to="/settings"
          className="hover:text-brand focus-visible:outline-brand py-1 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          설정
        </Link>
      </nav>
    </footer>
  );
}
