import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  BitacoraCreatePayload,
  BitacoraListParams,
  BitacoraUpdatePayload,
} from "@/features/attentions/api/attentions.contracts";
import { attentionsService } from "@/features/attentions/api/attentions.service";
import { operationalLabel, useCaseCatalog, useEntityCatalog, useStatusCatalog } from "@/features/attentions/api/operational-catalogs";
import { registryLabel, useRegistryCatalog } from "@/features/attentions/api/registry-catalog";

export const attentionKeys = {
  all: ["attentions"] as const,
  list: (params: BitacoraListParams) => ["attentions", "list", params] as const,
  files: (id: string) => ["attentions", id, "files"] as const,
};

export function useAttentions(params: BitacoraListParams = {}) {
  const catalog = useRegistryCatalog();
  const cases = useCaseCatalog();
  const statuses = useStatusCatalog();
  const entities = useEntityCatalog();
  const query = useQuery({
    queryKey: attentionKeys.list(params),
    queryFn: () => attentionsService.list(params),
  });

  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          items: query.data.items.map((attention) => ({
            ...attention,
            registry:
              registryLabel(catalog.data ?? [], attention.registryTypeId) ?? attention.registry,
            caseType:
              operationalLabel(cases.data ?? [], attention.caseTypeId) ?? attention.caseType,
            status:
              operationalLabel(statuses.data ?? [], attention.statusId) ?? attention.status,
            entity:
              operationalLabel(entities.data ?? [], attention.entityId) ?? attention.entity,
          })),
        }
      : undefined,
  };
}

export function useAttentionFiles(id?: string | null) {
  return useQuery({
    queryKey: attentionKeys.files(id ?? "none"),
    queryFn: () => attentionsService.listFiles(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useCreateAttention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BitacoraCreatePayload) => attentionsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: attentionKeys.all });
    },
  });
}

export function useUpdateAttention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BitacoraUpdatePayload }) =>
      attentionsService.update(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: attentionKeys.all }),
        queryClient.invalidateQueries({ queryKey: attentionKeys.files(variables.id) }),
      ]);
    },
  });
}

export function useUploadAttentionFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      attentionsService.uploadFile(id, file),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: attentionKeys.files(variables.id) });
    },
  });
}

export function useReplaceAttentionFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fileId, file }: { id: string; fileId: string; file: File }) =>
      attentionsService.replaceFile(id, fileId, file),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: attentionKeys.files(variables.id) });
    },
  });
}
