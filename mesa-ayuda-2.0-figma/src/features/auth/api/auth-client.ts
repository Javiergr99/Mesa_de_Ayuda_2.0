import type {
  ApiErrorPayload,
  TokenResponse,
} from "@/features/auth/api/auth.contracts";
import { authTokenStorage } from "@/features/auth/services/token-storage";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export const AUTH_SESSION_EXPIRED_EVENT =
  "mesa-ayuda:session-expired";

export class AuthApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(status: number, payload: ApiErrorPayload | null) {
    const nested =
      payload?.detail &&
      typeof payload.detail === "object" &&
      !Array.isArray(payload.detail)
        ? (payload.detail as { code?: string; detail?: string })
        : null;

    const detail =
      typeof payload?.detail === "string"
        ? payload.detail
        : nested?.detail ??
          "No fue posible completar la solicitud.";

    super(detail);
    this.name = "AuthApiError";
    this.status = status;
    this.code =
      payload?.code ?? nested?.code ?? `HTTP_${status}`;
    this.fieldErrors = payload?.field_errors;
  }
}

type AuthRequestOptions = {
  authenticated?: boolean;
  retryOnUnauthorized?: boolean;
};

let refreshPromise: Promise<TokenResponse> | null = null;

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  if (response.status === 204) return undefined as T;

  return (await response.json().catch(() => null)) as T;
}

async function parseApiError(
  response: Response,
): Promise<ApiErrorPayload | null> {
  return parseResponse<ApiErrorPayload | null>(response);
}

function rememberSessionHeader(): HeadersInit {
  return {
    "X-Remember-Session":
      authTokenStorage.getPersistence() === "persistent" ? "true" : "false",
  };
}

export async function refreshAuthSession(): Promise<TokenResponse> {
  if (!authTokenStorage.hasSession()) {
    throw new Error("No existe una sesión renovable.");
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...rememberSessionHeader(),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorPayload = await parseApiError(response);
          throw new AuthApiError(response.status, errorPayload);
        }

        const payload = await parseResponse<TokenResponse>(response);
        authTokenStorage.replace(payload);
        return payload;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  const activeRefresh = refreshPromise;
  if (!activeRefresh) {
    throw new Error("No fue posible iniciar la renovación de sesión.");
  }

  return activeRefresh;
}

export async function authRequest<T>(
  path: string,
  init: RequestInit = {},
  options: AuthRequestOptions = {},
): Promise<T> {
  const {
    authenticated = true,
    retryOnUnauthorized = true,
  } = options;

  const accessToken = authTokenStorage.getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (
    response.status === 401 &&
    authenticated &&
    retryOnUnauthorized &&
    authTokenStorage.hasSession()
  ) {
    try {
      await refreshAuthSession();
      return await authRequest<T>(path, init, {
        authenticated,
        retryOnUnauthorized: false,
      });
    } catch {
      authTokenStorage.clear();
      window.dispatchEvent(
        new CustomEvent(AUTH_SESSION_EXPIRED_EVENT),
      );
    }
  }

  if (!response.ok) {
    const errorPayload = await parseApiError(response);
    throw new AuthApiError(response.status, errorPayload);
  }

  return await parseResponse<T>(response);
}
