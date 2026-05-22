"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole       = "superadmin" | "admin" | "moderator" | "member" | "agent";
export type MembershipTier = "free" | "premium";

export interface AuthUser {
  id:              string;
  email:           string;
  username:        string;
  display_name:    string;
  avatar_url:      string | null;
  bio:             string | null;
  profession:      string;
  role:            UserRole;
  membership_tier: MembershipTier;
  is_verified:     boolean;
  is_active:       boolean;
  interests?:      string[];
  onboarding_completed?: boolean;
  created_at:      string;
}

type AuthStore = {
  user:            AuthUser | null;
  access_token:    string | null;
  isAuthenticated: boolean;
  _hasHydrated:    boolean;
  setHasHydrated:  (v: boolean) => void;
  login:           (user: AuthUser, token: string) => void;
  logout:          () => void;
  updateUser:      (partial: Partial<AuthUser>) => void;
  setToken:        (token: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:            null,
      access_token:    null,
      isAuthenticated: false,
      _hasHydrated:    false,
      setHasHydrated:  (v) => set({ _hasHydrated: v }),
      login:           (user, token) => set({ user, access_token: token, isAuthenticated: true }),
      logout:          () => set({ user: null, access_token: null, isAuthenticated: false }),
      updateUser:      (partial) =>
        set((state) => ({ user: state.user ? { ...state.user, ...partial } : null })),
      setToken:        (token) => set({ access_token: token }),
    }),
    {
      name: "tcm-auth",
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true); },
    }
  )
);
