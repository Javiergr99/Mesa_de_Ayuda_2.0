import {
  AuthApiError,
  AUTH_SESSION_EXPIRED_EVENT,
  refreshAuthSession,
} from "@/features/auth/api/auth-client";
import { authTokenStorage } from "@/features/auth/services/token-storage";
import { MesaAyudaApiError, type MesaAyudaErrorPayload } from "@/shared/api/mesa-ayuda-api-error";

const MESA_AYUDA_API_URL = import.meta.env.VITE_MESA_AYUDA_API_URL ?? "/mesa-api";

type RequestOptions = {
  retryOnUnauthorized?: boolean;
};

async function parsePayload<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  return (await response.json().catch(() => null)) as T;
}

function buildHeaders(init: RequestInit): Headers {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = authTokenStorage.getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

/**
 * La sesión central solo se invalida cuando auth_service confirma que el
 * refresh token dejó de ser válido. Un 401 de una API de negocio no debe
 * cerrar por sí solo la sesión universal.
 */
function shouldExpireCentralSession(error: unknown): boolean {
  return error instanceof AuthApiError && error.status === 401;
}

function expireCentralSession() {
  authTokenStorage.clear();
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}

async function executeMesaAyudaRequest<T>(
  path: string,
  init: RequestInit,
): Promise<{ response: Response; payload: T | MesaAyudaErrorPayload | null }> {
  const response = await fetch(`${MESA_AYUDA_API_URL}${path}`, {
    ...init,
    headers: buildHeaders(init),
  });
  const payload = await parsePayload<T | MesaAyudaErrorPayload | null>(response);
  return { response, payload };
}

export async function mesaAyudaRequest<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {},
): Promise<T> {
  const { retryOnUnauthorized = true } = options;
  const firstAttempt = await executeMesaAyudaRequest<T>(path, init);

  if (
    firstAttempt.response.status === 401 &&
    retryOnUnauthorized &&
    authTokenStorage.hasSession()
  ) {
    try {
      await refreshAuthSession();
    } catch (error) {
      if (shouldExpireCentralSession(error)) {
        expireCentralSession();
      }

      // Un fallo de red o un error 5xx de auth_service no debe destruir la
      // sesión local. Se conserva el contexto y se propaga el error real.
      throw error;
    }

    const retryAttempt = await executeMesaAyudaRequest<T>(path, init);
    if (!retryAttempt.response.ok) {
      throw new MesaAyudaApiError(
        retryAttempt.response.status,
        retryAttempt.payload as MesaAyudaErrorPayload | null,
      );
    }
    return retryAttempt.payload as T;
  }

  if (!firstAttempt.response.ok) {
    throw new MesaAyudaApiError(
      firstAttempt.response.status,
      firstAttempt.payload as MesaAyudaErrorPayload | null,
    );
  }

  return firstAttempt.payload as T;
}

export function toSearchParams(
  values: Record<string, string | number | boolean | null | undefined>,
): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}
