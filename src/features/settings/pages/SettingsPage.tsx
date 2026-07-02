import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { useUiStore } from "@/stores/ui-store";

export function SettingsPage() {
  const density = useUiStore((state) => state.density);
  const setDensity = useUiStore((state) => state.setDensity);
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  return (
    <section className="grid max-w-2xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">설정</h1>
        <p className="mt-1 text-sm text-slate-500">
          Zustand가 담당하는 클라이언트 UI 상태 예제입니다.
        </p>
      </div>
      <Card className="grid gap-4 p-6">
        <div className="grid gap-1.5">
          <Label htmlFor="theme">테마</Label>
          <Select
            id="theme"
            value={theme}
            onChange={(event) =>
              setTheme(event.target.value as "light" | "dark" | "system")
            }
            className="w-full"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="density">밀도</Label>
          <Select
            id="density"
            value={density}
            onChange={(event) =>
              setDensity(event.target.value as "comfortable" | "compact")
            }
            className="w-full"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </Select>
        </div>
      </Card>
    </section>
  );
}
