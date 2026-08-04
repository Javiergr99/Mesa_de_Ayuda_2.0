import { authRepository } from "@/features/auth/api/auth.repository";
import { useAuthStore } from "@/features/auth/model/auth.store";

const CHANNEL_NAME = "mesa-ayuda-auth-session";

/**
 * Cierra la sesión tanto en el servicio remoto como en el estado visual.
 * El cierre local se ejecuta aunque el backend no responda para no conservar
 * una interfaz autenticada con una sesión posiblemente inválida.
 */
export async function performLogout(reason?: "inactivity"): Promise<void> {
  try {
    await authRepository.logout();
  } catch {
    // El cierre local es prioritario; el error remoto no debe impedirlo.
  } finally {
    useAuthStore.getState().logout();

    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: "logout" });
      channel.close();
    }

    if (reason === "inactivity") {
      window.location.replace("/login?reason=inactivity");
    }
  }
}

export const sessionChannelName = CHANNEL_NAME;
