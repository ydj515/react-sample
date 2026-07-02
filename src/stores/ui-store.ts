import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark";
type Density = "comfortable" | "compact";

const defaultUiPreferences = {
  theme: "light",
  density: "comfortable",
} as const satisfies Pick<UiState, "theme" | "density">;

type UiState = {
  sidebarOpen: boolean;
  theme: Theme;
  density: Density;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  resetSettings: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      ...defaultUiPreferences,
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      resetSettings: () => set(defaultUiPreferences),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
    }),
    {
      name: "react-sample-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        density: state.density,
        theme: state.theme,
      }),
    },
  ),
);
