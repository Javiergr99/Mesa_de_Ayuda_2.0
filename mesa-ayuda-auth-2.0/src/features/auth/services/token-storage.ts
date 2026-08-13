import type { TokenResponse } from "@/features/auth/api/auth.contracts";
import {
  sessionPersistence,
  type TokenPersistence,
} from "@/features/auth/services/session-persistence";

export type { TokenPersistence } from "@/features/auth/services/session-persistence";

let accessToken: string | null = null;

/**
 * El access token vive solo en memoria. El refresh token real permanece en la
 * cookie HttpOnly establecida por auth_service y nunca es legible desde aquí.
 */
export const authTokenStorage = {
  save(tokens: TokenResponse, rememberSession = false) {
    accessToken = tokens.access_token;
    sessionPersistence.save(
      rememberSession ? "persistent" : "session",
    );
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  getPersistence(): TokenPersistence {
    return sessionPersistence.get();
  },

  replace(tokens: TokenResponse) {
    accessToken = tokens.access_token;
  },

  hasSession(): boolean {
    return Boolean(accessToken) || sessionPersistence.has();
  },

  clear() {
    accessToken = null;
    sessionPersistence.clear();
  },
};
