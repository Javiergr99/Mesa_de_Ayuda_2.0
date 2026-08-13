import { useEffect, type ReactNode } from "react";

import { AUTH_SESSION_EXPIRED_EVENT } from "@/features/auth/api/auth-client";
import { authService } from "@/features/auth/api/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { queryClient } from "@/app/providers/query-client";
import { redirectToAuthLogout } from "@/features/auth/services/auth-navigation";
import {
  cleanExchangeNavigationParameters,
  readExchangeNavigationRequest,
  type ExchangeNavigationRequest,
} from "@/features/auth/services/exchange-navigation";
import {
  authTokenStorage,
  type TokenPersistence,
} from "@/features/auth/services/token-storage";

const AUTH_CHANNEL = "mesa-ayuda-auth-session";
const INACTIVITY_LIMIT_MS = 60 * 60 * 1_000;
const activityEvents: Array<keyof WindowEventMap> = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];

let exchangePromise: Promise<void> | null = null;

type SessionMessage = {
  type: "logout";
  reason: "manual" | "inactivity" | "session-expired";
};

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "No fue posible completar el acceso a Mesa de Ayuda.";
}

async function exchangeAndHydrate(code: string, persistence: TokenPersistence) {
  const tokens = await authService.exchangeCode(code, persistence);
  authTokenStorage.save(tokens, persistence);
  const user = await authService.getCurrentUser();
  useAuthStore.getState().setAuthenticated(user);
}

export async function logoutCurrentSession(
  reason: SessionMessage["reason"] = "manual",
) {
  try {
    await authService.logout();
  } catch {
    // La sesión local siempre se elimina aunque el logout remoto falle.
  } finally {
    authTokenStorage.clear();
    queryClient.clear();
    useAuthStore.getState().setAnonymous();
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(AUTH_CHANNEL);
      channel.postMessage({ type: "logout", reason } satisfies SessionMessage);
      channel.close();
    }
    redirectToAuthLogout(reason);
  }
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let active = true;
    const url = new URL(window.location.href);

    const initialize = async () => {
      let exchangeRequest: ExchangeNavigationRequest | null;

      try {
        exchangeRequest = readExchangeNavigationRequest(url);
      } catch (error) {
        window.history.replaceState(
          {},
          document.title,
          cleanExchangeNavigationParameters(url),
        );
        authTokenStorage.clear();
        if (active) useAuthStore.getState().setError(errorMessage(error));
        return;
      }

      if (exchangeRequest) {
        useAuthStore.getState().setExchanging();
        window.history.replaceState(
          {},
          document.title,
          cleanExchangeNavigationParameters(url),
        );

        if (!exchangePromise) {
          exchangePromise = exchangeAndHydrate(
            exchangeRequest.code,
            exchangeRequest.persistence,
          ).finally(() => {
            exchangePromise = null;
          });
        }

        try {
          await exchangePromise;
        } catch (error) {
          authTokenStorage.clear();
          if (active) useAuthStore.getState().setError(errorMessage(error));
        }
        return;
      }

      if (exchangePromise) {
        useAuthStore.getState().setExchanging();
        try {
          await exchangePromise;
        } catch (error) {
          authTokenStorage.clear();
          if (active) useAuthStore.getState().setError(errorMessage(error));
        }
        return;
      }

      if (!authTokenStorage.hasSession()) {
        useAuthStore.getState().setAnonymous();
        return;
      }

      useAuthStore.getState().setChecking();
      try {
        const user = await authService.getCurrentUser();
        if (active) useAuthStore.getState().setAuthenticated(user);
      } catch {
        authTokenStorage.clear();
        if (active) useAuthStore.getState().setAnonymous();
      }
    };

    void initialize();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      authTokenStorage.clear();
      queryClient.clear();
      useAuthStore.getState().setAnonymous();
      redirectToAuthLogout("session-expired");
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () =>
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return undefined;
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    const onMessage = (event: MessageEvent<SessionMessage>) => {
      if (event.data?.type !== "logout") return;
      authTokenStorage.clear();
      queryClient.clear();
      useAuthStore.getState().setAnonymous();
      redirectToAuthLogout(event.data.reason);
    };

    channel.addEventListener("message", onMessage);
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, []);

  const status = useAuthStore((state) => state.status);
  useEffect(() => {
    if (status !== "authenticated") return undefined;
    let timeoutId = 0;

    const scheduleLogout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        void logoutCurrentSession("inactivity");
      }, INACTIVITY_LIMIT_MS);
    };

    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, scheduleLogout, { passive: true }),
    );
    scheduleLogout();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, scheduleLogout),
      );
    };
  }, [status]);

  return children;
}
