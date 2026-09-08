import { Card } from "@/shared/ui/card";

export function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <Card className="compact:p-4 p-5">
      <p className="text-ink-subtle text-sm">{label}</p>
      <p className="text-ink mt-2 text-[28px] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {note ? <p className="text-ink-subtle mt-2 text-xs">{note}</p> : null}
    </Card>
  );
}
