import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="border-line rounded-panel my-6 min-w-0 overflow-hidden border">
      <div className="bg-surface-muted border-line flex items-center justify-between gap-3 border-b px-4 py-2">
        <span className="text-ink-subtle font-mono text-xs">{language}</span>
        <Button variant="ghost" size="sm" onClick={copy} aria-label="코드 복사">
          <Copy aria-hidden className="size-3.5" />
          복사
        </Button>
      </div>
      <pre
        tabIndex={0}
        aria-label={`${language} 코드`}
        className="bg-canvas text-ink focus-visible:outline-brand overflow-x-auto p-5 text-[13px] leading-7"
      >
        <code>{code}</code>
      </pre>
      {status === "copied" && (
        <p role="status" className="text-positive px-4 py-2 text-xs">
          복사했습니다.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-negative px-4 py-2 text-xs">
          복사할 수 없습니다. 코드를 선택해 직접 복사하세요.
        </p>
      )}
    </div>
  );
}
