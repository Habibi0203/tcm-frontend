"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockUser } from "@/mock/users";

type AuthStore = {
  user: MockUser | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  // Actions
  setHasHydrated: (v: boolean) => void;
  login: (user: MockUser) => void;
  logout: () => void;
  updateUser: (partial: Partial<MockUser>) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "tcm-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
