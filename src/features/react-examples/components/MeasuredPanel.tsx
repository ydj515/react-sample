import { useCallback, useState } from "react";

export function MeasuredPanel() {
  const [width, setWidth] = useState(0);
  const observe = useCallback((node: HTMLDivElement | null) => {
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={observe}
      className="border-line rounded-control border border-dashed p-4"
    >
      <p className="text-sm">관찰 중인 패널 너비: {width}px</p>
      <p className="text-ink-subtle mt-2 text-xs">
        창 크기를 변경해 보세요. 패널이 제거되면 ref 정리 함수가 observer를
        해제합니다.
      </p>
    </div>
  );
}
