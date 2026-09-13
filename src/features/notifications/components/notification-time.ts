const RELATIVE_THRESHOLDS: Array<{
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}> = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
];

const formatter = new Intl.RelativeTimeFormat("ko-KR", { numeric: "auto" });

export function formatNotificationTime(iso: string, now: number = Date.now()) {
  const diff = now - new Date(iso).getTime();
  for (const { unit, ms } of RELATIVE_THRESHOLDS) {
    if (Math.abs(diff) >= ms || unit === "minute") {
      return formatter.format(Math.round(-diff / ms), unit);
    }
  }
  return formatter.format(Math.round(-diff / 1000), "second");
}
