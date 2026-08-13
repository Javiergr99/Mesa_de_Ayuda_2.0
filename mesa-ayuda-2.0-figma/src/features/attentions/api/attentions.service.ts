import type {
  BitacoraCreatePayload,
  BitacoraListParams,
  BitacoraUpdatePayload,
} from "@/features/attentions/api/attentions.contracts";
import { httpAttentionsRepository } from "@/features/attentions/api/http-attentions.repository";
import {
  mapArchivoToAttentionFile,
  mapBitacoraToAttention,
} from "@/features/attentions/model/attention.mapper";

const repository = httpAttentionsRepository;

export const attentionsService = {
  async list(params: BitacoraListParams = {}) {
    const response = await repository.list(params);
    return {
      ...response,
      items: response.items.map(mapBitacoraToAttention),
    };
  },

  async create(payload: BitacoraCreatePayload) {
    const created = await repository.create(payload);
    return mapBitacoraToAttention(created);
  },

  async update(id: string, payload: BitacoraUpdatePayload) {
    const updated = await repository.update(id, payload);
    return mapBitacoraToAttention(updated);
  },

  remove(id: string) {
    return repository.remove(id);
  },

  async listFiles(id: string) {
    const files = await repository.listFiles(id);
    return files.map(mapArchivoToAttentionFile);
  },

  uploadFile(id: string, file: File) {
    return repository.uploadFile(id, file);
  },

  replaceFile(id: string, fileId: string, file: File) {
    return repository.replaceFile(id, fileId, file);
  },
};
