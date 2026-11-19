import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/app/providers/query-client";
import { mesaAyudaRequest } from "@/shared/api/mesa-ayuda-api-client";

import type { RegistryCatalogItem } from "@/features/attentions/model/registry-catalog.model";
export { registryOptions, registryLabel } from "@/features/attentions/model/registry-catalog.model";
export type { RegistryCatalogItem } from "@/features/attentions/model/registry-catalog.model";

export const registryCatalogKey = ["mesa-ayuda", "catalogos", "tipos-registro"] as const;

function fetchRegistryCatalog(): Promise<RegistryCatalogItem[]> {
  return mesaAyudaRequest<RegistryCatalogItem[]>("/api/v1/catalogos/tipos-registro");
}

export function useRegistryCatalog() {
  return useQuery({
    queryKey: registryCatalogKey,
    queryFn: fetchRegistryCatalog,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}

export function loadRegistryCatalog() {
  return queryClient.fetchQuery({
    queryKey: registryCatalogKey,
    queryFn: fetchRegistryCatalog,
    staleTime: 30_000,
  });
}
