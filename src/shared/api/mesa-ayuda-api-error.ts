export type MesaAyudaValidationIssue = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

export type MesaAyudaErrorPayload = {
  detail?: string | MesaAyudaValidationIssue[] | Record<string, unknown>;
};

function getErrorMessage(status: number, payload: MesaAyudaErrorPayload | null): string {
  if (typeof payload?.detail === "string") return payload.detail;

  if (Array.isArray(payload?.detail)) {
    const messages = payload.detail
      .map((issue) => issue.msg)
      .filter((message): message is string => Boolean(message));
    if (messages.length) return messages.join(" · ");
  }

  if (status === 401)
    return "La API de Mesa de Ayuda no pudo validar el token de acceso. Tu sesión central permanece activa.";
  if (status === 403) return "No cuenta con la acción requerida para realizar esta operación.";
  if (status === 404) return "El recurso solicitado no existe o ya no está disponible.";
  if (status === 413) return "El archivo supera el tamaño máximo permitido de 20 MB.";
  if (status === 422) return "La solicitud contiene datos que no cumplen el contrato de la API.";
  return "No fue posible completar la solicitud en API Mesa de Ayuda.";
}

export class MesaAyudaApiError extends Error {
  readonly status: number;
  readonly payload: MesaAyudaErrorPayload | null;

  constructor(status: number, payload: MesaAyudaErrorPayload | null) {
    super(getErrorMessage(status, payload));
    this.name = "MesaAyudaApiError";
    this.status = status;
    this.payload = payload;
  }
}
