import { Markdown } from "@/features/cms/components";

export function NotePreview({ source }: { source: string }) {
  return (
    <div className="min-w-0 space-y-4">
      {source.split(/(```[^\n]*\n[\s\S]*?(?:```|$))/g).map((block, index) => {
        if (!block.startsWith("```")) {
          return <Markdown key={index} source={block} />;
        }
        const newline = block.indexOf("\n");

        const language = block.slice(3, newline).trim();

        const code = block.slice(newline + 1).replace(/```$/, "");

        const supported = /^(js|jsx|javascript|ts|tsx|typescript|json)$/.test(
          language,
        );
        return (
          <figure key={index} className="min-w-0">
            <figcaption className="text-ink-subtle text-xs">
              {language || "text"}
            </figcaption>
            <pre className="bg-surface-muted overflow-auto rounded-lg p-4 text-sm">
              <code>
                {supported
                  ? code
                      .split(
                        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/[^\n]*|\b(?:const|let|function|return|if|else|import|from|export|true|false|null|async|await)\b|\b\d+(?:\.\d+)?\b)/g,
                      )
                      .map((token, i) => (
                        <span
                          key={i}
                          className={
                            /^["']/.test(token)
                              ? "text-positive"
                              : /^(?:const|let|function|return|if|else|import|from|export|true|false|null|async|await)$/.test(
                                    token,
                                  )
                                ? "text-brand font-semibold"
                                : /^\d/.test(token)
                                  ? "text-warning"
                                  : token.startsWith("//")
                                    ? "text-ink-subtle italic"
                                    : undefined
                          }
                        >
                          {token}
                        </span>
                      ))
                  : code}
              </code>
            </pre>
          </figure>
        );
      })}
    </div>
  );
}
