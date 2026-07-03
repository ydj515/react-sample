import { useEffect, type ReactNode } from "react";

import { QueryProvider } from "@/app/providers/QueryProvider";
import { useUiStore } from "@/stores/ui-store";

export function AppProviders({ children }: { children: ReactNode }) {
  const density = useUiStore((state) => state.density);
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.density = density;
    document.documentElement.dataset.theme = theme;
  }, [density, theme]);

  return <QueryProvider>{children}</QueryProvider>;
}
