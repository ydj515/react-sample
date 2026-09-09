import { Plus } from "lucide-react";
export function LandingFaq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="border-line divide-line divide-y border-y">
      {items.map((item) => (
        <details key={item.question} className="group py-1">
          <summary className="focus-visible:outline-brand flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              className="text-ink-subtle size-4 shrink-0 group-open:rotate-45"
              aria-hidden
            />
          </summary>
          <p className="text-ink-muted max-w-3xl pb-5 text-sm leading-7">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
