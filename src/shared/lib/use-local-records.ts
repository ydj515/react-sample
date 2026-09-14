import { useCallback, useState } from "react";
import type { z } from "zod";

// 읽기 실패 시 원본을 덮어쓰지 않으며, 저장 성공 후에만 화면 상태를 갱신한다.
export function useLocalRecords<T>(
  key: string,
  schema: z.ZodType<T>,
  initial: () => T,
) {
  const [loaded] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return {
        data: raw ? schema.parse(JSON.parse(raw)) : initial(),
        blocked: false,
      };
    } catch {
      return { data: initial(), blocked: true };
    }
  });

  const [data, setData] = useState(loaded.data);

  const [error, setError] = useState(
    loaded.blocked
      ? "저장 데이터를 읽을 수 없습니다. 원본 보호를 위해 변경을 중단했습니다."
      : "",
  );

  const save = useCallback(
    (next: T) => {
      if (loaded.blocked) return false;
      try {
        const validated = schema.parse(next);
        localStorage.setItem(key, JSON.stringify(validated));
        setData(validated);
        setError("");
        return true;
      } catch {
        setError(
          "저장하지 못했습니다. 입력값과 브라우저 저장 공간을 확인하세요.",
        );
        return false;
      }
    },
    [key, loaded.blocked, schema],
  );
  return { data, save, error, blocked: loaded.blocked };
}
