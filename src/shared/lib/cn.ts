import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// 공통 모서리 토큰도 rounded-none 등과 동일한 충돌 그룹으로 처리한다.
const mergeClasses = extendTailwindMerge({
  extend: { theme: { radius: ["control", "panel"] } },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs));
}
