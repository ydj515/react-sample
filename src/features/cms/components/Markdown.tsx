import { safeMarkdownUrl } from "@/features/cms/model/markdown-url";
import { Fragment } from "react";
import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\s)]+\))/g)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-surface-muted rounded px-1 font-mono text-sm"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (match) {
        const href = safeMarkdownUrl(match[2]!);
        return href ? (
          <a key={i} href={href} className="text-brand underline">
            {match[1]}
          </a>
        ) : (
          <Fragment key={i}>{match[1]}</Fragment>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
}

export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];

  const lines = source.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;
    if (line.startsWith("```")) {
      const code: string[] = [];
      while (++i < lines.length && !lines[i]!.startsWith("```")) {
        code.push(lines[i]!);
      }
      blocks.push(
        <pre
          key={i}
          className="bg-surface-muted overflow-auto rounded-lg p-4 text-sm"
        >
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push(
        <h2 key={i} className="mt-6 text-xl font-semibold">
          {inline(heading[2]!)}
        </h2>,
      );
      continue;
    }
    if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);

      const pattern = ordered ? /^\d+\. / : /^[-*] /;

      const items: ReactNode[] = [];
      do {
        items.push(<li key={i}>{inline(lines[i]!.replace(pattern, ""))}</li>);
        i++;
      } while (i < lines.length && pattern.test(lines[i]!));
      i--;
      blocks.push(
        ordered ? (
          <ol key={i} className="list-decimal space-y-1 pl-6">
            {items}
          </ol>
        ) : (
          <ul key={i} className="list-disc space-y-1 pl-6">
            {items}
          </ul>
        ),
      );
      continue;
    }
    blocks.push(
      line.startsWith("> ") ? (
        <blockquote key={i} className="border-brand border-l-4 pl-4">
          {inline(line.slice(2))}
        </blockquote>
      ) : (
        <p key={i} className="whitespace-pre-wrap">
          {inline(line)}
        </p>
      ),
    );
  }
  return (
    <div className="min-w-0 space-y-4 text-sm leading-7 break-words">
      {blocks}
    </div>
  );
}
