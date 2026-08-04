import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthUser, LoginResult } from "@/features/auth/model/auth.types";

const AUTH_STORAGE_KEY = "mesa-ayuda-auth-demo";

type AuthState = {
  user: AuthUser | null;
  tempToken: string | null;
  requiresMfaSetup: boolean;
  setPendingLogin: (result: LoginResult) => void;
  completeAuthentication: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tempToken: null,
      requiresMfaSetup: false,
      setPendingLogin: (result) =>
        set({
          user: null,
          tempToken: result.tempToken,
          requiresMfaSetup: result.requiresMfaSetup,
        }),
      completeAuthentication: (user) =>
        set({
          user,
          tempToken: null,
          requiresMfaSetup: false,
        }),
      logout: () => set({ user: null, tempToken: null, requiresMfaSetup: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        tempToken: state.tempToken,
        requiresMfaSetup: state.requiresMfaSetup,
      }),
    },
  ),
);
