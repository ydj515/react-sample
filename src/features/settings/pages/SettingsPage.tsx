import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { useUiStore, type UiState } from "@/stores/ui-store";

const densityDescriptions = {
  comfortable:
    "Comfortable은 페이지와 카드 여백을 넓게 유지합니다. 읽기 편한 기본 보기입니다.",
  compact:
    "Compact는 사이드바, 헤더, 본문 여백을 줄입니다. 버튼과 입력 높이도 작아져 한 화면에 더 많은 정보를 보여줍니다.",
} as const;

export function SettingsPage() {
  const density = useUiStore((state) => state.density);
  const resetSettings = useUiStore((state) => state.resetSettings);
  const setDensity = useUiStore((state) => state.setDensity);
  const isCompact = density === "compact";

  return (
    <section
      className={isCompact ? "grid max-w-2xl gap-4" : "grid max-w-2xl gap-6"}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">설정</h1>
        <p className="mt-1 text-sm text-slate-500">
          Zustand가 담당하는 클라이언트 UI 상태 예제입니다.
        </p>
      </div>
      <Card className={isCompact ? "grid gap-3 p-4" : "grid gap-4 p-6"}>
        <div className="grid gap-1.5">
          <Label htmlFor="density">밀도</Label>
          <Select
            id="density"
            value={density}
            onChange={(event) =>
              setDensity(event.target.value as UiState["density"])
            }
            className="w-full"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </Select>
        </div>
        <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {densityDescriptions[density]}
        </p>
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            이 설정은 브라우저에 저장됩니다.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={resetSettings}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            설정 초기화
          </Button>
        </div>
      </Card>
    </section>
  );
}
