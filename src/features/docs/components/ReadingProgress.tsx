import { useEffect, useState } from "react";
import { readingProgress } from "../model/reading-progress";

export function ReadingProgress() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setValue(
          readingProgress(
            window.scrollY,
            document.documentElement.scrollHeight,
            window.innerHeight,
          ),
        ),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);
  return (
    <div
      role="progressbar"
      aria-label="문서 읽기 진행률"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="bg-line pointer-events-none absolute right-0 bottom-0 left-0 h-0.5 overflow-hidden"
    >
      <div
        className="bg-brand h-full origin-left"
        style={{ transform: `scaleX(${value / 100})` }}
      />
    </div>
  );
}
