import type { AuthRepository, AuthSession, LoginInput, LoginResult, VerifyMfaInput } from "@/features/auth/model/auth.types";
import { env } from "@/shared/config/env";

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string; message?: string } | null;
    throw new Error(payload?.detail ?? payload?.message ?? "No fue posible completar la solicitud.");
  }

  return (await response.json()) as T;
}

export const httpAuthRepository: AuthRepository = {
  login(input: LoginInput): Promise<LoginResult> {
    return request<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier: input.identifier, password: input.password }),
    });
  },

  verifyMfa(input: VerifyMfaInput): Promise<AuthSession> {
    return request<AuthSession>("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ temp_token: input.tempToken, code: input.code }),
    });
  },

  configureMfa(input: VerifyMfaInput): Promise<AuthSession> {
    return request<AuthSession>("/auth/2fa/confirm", {
      method: "POST",
      body: JSON.stringify({ temp_token: input.tempToken, code: input.code }),
    });
  },

  async logout(): Promise<void> {
    await request<{ ok: boolean }>("/auth/logout", { method: "POST" });
  },
};
