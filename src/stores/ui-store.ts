import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark";
type Density = "comfortable" | "compact";

const defaultUiPreferences = {
  theme: "light",
  density: "comfortable",
} as const satisfies Pick<UiState, "theme" | "density">;

export type UiState = {
  theme: Theme;
  density: Density;
  toggleTheme: () => void;
  resetSettings: () => void;
  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      ...defaultUiPreferences,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      resetSettings: () => set(defaultUiPreferences),
      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
    }),
    {
      name: "react-sample-ui",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        density: state.density,
        theme: state.theme,
      }),
    },
  ),
);
