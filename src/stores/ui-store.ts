import { create } from "zustand";

type Theme = "light" | "dark" | "system";
type Density = "comfortable" | "compact";

type UiState = {
  sidebarOpen: boolean;
  theme: Theme;
  density: Density;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  theme: "light",
  density: "comfortable",
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => set({ theme }),
  setDensity: (density) => set({ density }),
}));
