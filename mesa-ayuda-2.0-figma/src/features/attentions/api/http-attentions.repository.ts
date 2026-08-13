import type {
  BitacoraApiRecord,
  BitacoraArchivoApi,
  BitacoraCreatePayload,
  BitacoraListParams,
  BitacoraListResponse,
  BitacoraUpdatePayload,
} from "@/features/attentions/api/attentions.contracts";
import type { AttentionsRepository } from "@/features/attentions/api/attentions.repository";
import {
  mesaAyudaRequest,
  toSearchParams,
} from "@/shared/api/mesa-ayuda-api-client";

function listQuery(params: BitacoraListParams = {}): string {
  return toSearchParams(params as Record<string, string | number | undefined>);
}

function fileBody(file: File): FormData {
  const body = new FormData();
  // El contrato documenta multipart/form-data; el nombre "archivo" sigue la
  // nomenclatura del recurso y queda aislado aquí para cambiarlo si OpenAPI
  // publica un nombre distinto.
  body.append("archivo", file);
  return body;
}

export const httpAttentionsRepository: AttentionsRepository = {
  list(params = {}): Promise<BitacoraListResponse> {
    return mesaAyudaRequest<BitacoraListResponse>(
      `/api/v1/bitacoras/${listQuery(params)}`,
    );
  },

  create(payload: BitacoraCreatePayload): Promise<BitacoraApiRecord> {
    return mesaAyudaRequest<BitacoraApiRecord>("/api/v1/bitacoras/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: BitacoraUpdatePayload): Promise<BitacoraApiRecord> {
    return mesaAyudaRequest<BitacoraApiRecord>(`/api/v1/bitacoras/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return mesaAyudaRequest<void>(`/api/v1/bitacoras/${id}`, {
      method: "DELETE",
    });
  },

  listFiles(id: string): Promise<BitacoraArchivoApi[]> {
    return mesaAyudaRequest<BitacoraArchivoApi[]>(
      `/api/v1/bitacoras/${id}/archivos`,
    );
  },

  uploadFile(id: string, file: File): Promise<BitacoraArchivoApi> {
    return mesaAyudaRequest<BitacoraArchivoApi>(
      `/api/v1/bitacoras/${id}/archivos`,
      { method: "POST", body: fileBody(file) },
    );
  },

  replaceFile(id: string, fileId: string, file: File): Promise<BitacoraArchivoApi> {
    return mesaAyudaRequest<BitacoraArchivoApi>(
      `/api/v1/bitacoras/${id}/archivos/${fileId}`,
      { method: "PUT", body: fileBody(file) },
    );
  },
};
