import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/ui/dialog";

export function LandingMenu({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="랜딩 메뉴 열기"
        >
          <Menu aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-0 right-0 left-auto h-dvh w-[min(22rem,90vw)] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none">
        <div className="flex items-center justify-between">
          <DialogTitle>페이지 메뉴</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="메뉴 닫기">
              <X aria-hidden />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="text-ink-subtle mt-2 text-sm">
          관심 있는 섹션으로 이동하세요.
        </DialogDescription>
        <nav aria-label="모바일 랜딩 메뉴" className="mt-8 flex flex-col gap-2">
          {items.map((item) => (
            <DialogClose asChild key={item.href}>
              <a
                href={item.href}
                className="hover:bg-surface-muted focus-visible:outline-brand rounded-control px-3 py-4 font-medium"
              >
                {item.label}
              </a>
            </DialogClose>
          ))}
          <DialogClose asChild>
            <Link
              to="/landing"
              className="text-brand border-line mt-4 border-t px-3 py-4"
            >
              모든 랜딩 샘플
            </Link>
          </DialogClose>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
