import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/model/auth.store";
import { performLogout, sessionChannelName } from "@/features/auth/services/session-security";

const INACTIVITY_LIMIT_MS = 60 * 60 * 1_000;
const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];

export function SessionSecurityProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    let timeoutId = 0;

    const scheduleLogout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        void performLogout("inactivity");
      }, INACTIVITY_LIMIT_MS);
    };

    // Cada interacción relevante renueva la ventana de actividad de 60 minutos.
    for (const eventName of activityEvents) {
      window.addEventListener(eventName, scheduleLogout, { passive: true });
    }

    const channel = "BroadcastChannel" in window ? new BroadcastChannel(sessionChannelName) : null;
    channel?.addEventListener("message", (event: MessageEvent<{ type?: string }>) => {
      if (event.data.type === "logout") useAuthStore.getState().logout();
    });

    scheduleLogout();

    return () => {
      window.clearTimeout(timeoutId);
      for (const eventName of activityEvents) window.removeEventListener(eventName, scheduleLogout);
      channel?.close();
    };
  }, [user]);

  return children;
}
