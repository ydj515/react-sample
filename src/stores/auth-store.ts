import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (payload: { token: string; user: AuthUser }) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      signIn: ({ token, user }) => set({ token, user, isAuthenticated: true }),
      signOut: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "react-sample-auth",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
