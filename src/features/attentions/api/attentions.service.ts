import type {
  BitacoraCreatePayload,
  BitacoraListParams,
  BitacoraUpdatePayload,
} from "@/features/attentions/api/attentions.contracts";
import { httpAttentionsRepository } from "@/features/attentions/api/http-attentions.repository";
import { loadRegistryCatalog, type RegistryCatalogItem } from "@/features/attentions/api/registry-catalog";
import { loadOperationalCatalogs } from "@/features/attentions/api/operational-catalogs";
import {
  mapArchivoToAttentionFile,
  mapBitacoraToAttention,
} from "@/features/attentions/model/attention.mapper";

const repository = httpAttentionsRepository;

// Si el catálogo no responde, la consulta de bitácoras sigue disponible.
async function catalogForLabels(): Promise<RegistryCatalogItem[]> {
  try {
    return await loadRegistryCatalog();
  } catch {
    return [];
  }
}

export const attentionsService = {
  async list(params: BitacoraListParams = {}) {
    const [response, registryCatalog, operational] = await Promise.all([
      repository.list(params),
      catalogForLabels(),
      loadOperationalCatalogs(),
    ]);
    return {
      ...response,
      items: response.items.map((record) =>
        mapBitacoraToAttention(record, registryCatalog, operational.cases, operational.statuses, operational.entities),
      ),
    };
  },

  async create(payload: BitacoraCreatePayload) {
    const created = await repository.create(payload);
    const [registry, operational] = await Promise.all([catalogForLabels(), loadOperationalCatalogs()]);
    return mapBitacoraToAttention(created, registry, operational.cases, operational.statuses, operational.entities);
  },

  async update(id: string, payload: BitacoraUpdatePayload) {
    const updated = await repository.update(id, payload);
    const [registry, operational] = await Promise.all([catalogForLabels(), loadOperationalCatalogs()]);
    return mapBitacoraToAttention(updated, registry, operational.cases, operational.statuses, operational.entities);
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
