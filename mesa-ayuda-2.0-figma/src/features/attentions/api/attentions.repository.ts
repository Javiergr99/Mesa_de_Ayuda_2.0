import type {
  BitacoraApiRecord,
  BitacoraArchivoApi,
  BitacoraCreatePayload,
  BitacoraListParams,
  BitacoraListResponse,
  BitacoraUpdatePayload,
} from "@/features/attentions/api/attentions.contracts";

export interface AttentionsRepository {
  list(params?: BitacoraListParams): Promise<BitacoraListResponse>;
  create(payload: BitacoraCreatePayload): Promise<BitacoraApiRecord>;
  update(id: string, payload: BitacoraUpdatePayload): Promise<BitacoraApiRecord>;
  remove(id: string): Promise<void>;
  listFiles(id: string): Promise<BitacoraArchivoApi[]>;
  uploadFile(id: string, file: File): Promise<BitacoraArchivoApi>;
  replaceFile(id: string, fileId: string, file: File): Promise<BitacoraArchivoApi>;
}
