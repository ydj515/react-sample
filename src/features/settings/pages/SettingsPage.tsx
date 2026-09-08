import { PageHeader } from "@/shared/ui/page-header";
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
      <PageHeader
        title="설정"
        description="화면의 정보 밀도를 원하는 작업 방식에 맞춰 설정하세요."
      />
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
        <p className="rounded-control bg-surface-muted text-ink-muted p-3 text-sm">
          {densityDescriptions[density]}
        </p>
        <div className="border-line flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-subtle text-sm">
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
