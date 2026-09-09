export function readingProgress(
  scrollTop: number,
  height: number,
  viewport: number,
) {
  const distance = height - viewport;
  return distance <= 0
    ? 100
    : Math.min(100, Math.max(0, (scrollTop / distance) * 100));
}
