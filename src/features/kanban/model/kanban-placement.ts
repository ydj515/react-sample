/** 보이는 카드 사이의 자리를 숨겨진 카드를 포함한 저장 인덱스로 변환한다. */
export function resolveMoveIndex(
  remainingIds: string[],
  visibleIds: string[],
  visibleIndex: number,
): number {
  const next = visibleIds[visibleIndex];
  if (next) return remainingIds.indexOf(next);
  const previous = visibleIds[visibleIndex - 1];
  return previous ? remainingIds.indexOf(previous) + 1 : remainingIds.length;
}
