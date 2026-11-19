import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/app/providers/query-client";
import { mesaAyudaRequest } from "@/shared/api/mesa-ayuda-api-client";
import type { OperationalCatalogItem } from "@/features/attentions/model/operational-catalog.model";

export { operationalOptions, operationalLabel } from "@/features/attentions/model/operational-catalog.model";
export type { OperationalCatalogItem } from "@/features/attentions/model/operational-catalog.model";

const caseKey = ["mesa-ayuda", "catalogos", "tipos-caso"] as const;
const statusKey = ["mesa-ayuda", "catalogos", "estatus-bitacora"] as const;
const entitiesKey = ["mesa-ayuda", "catalogos", "entidades-federativas"] as const;

function fetchCases(): Promise<OperationalCatalogItem[]> {
  return mesaAyudaRequest<OperationalCatalogItem[]>("/api/v1/catalogos/tipos-caso");
}

function fetchStatuses(): Promise<OperationalCatalogItem[]> {
  return mesaAyudaRequest<OperationalCatalogItem[]>("/api/v1/catalogos/estatus-bitacora");
}

function fetchEntities(): Promise<OperationalCatalogItem[]> {
  return mesaAyudaRequest<OperationalCatalogItem[]>("/api/v1/catalogos/entidades-federativas");
}

export function useCaseCatalog() {
  return useQuery({
    queryKey: caseKey,
    queryFn: fetchCases,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}

export function useStatusCatalog() {
  return useQuery({
    queryKey: statusKey,
    queryFn: fetchStatuses,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}

export function useEntityCatalog() {
  return useQuery({
    queryKey: entitiesKey,
    queryFn: fetchEntities,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}

export async function loadOperationalCatalogs(): Promise<{
  cases: OperationalCatalogItem[];
  statuses: OperationalCatalogItem[];
  entities: OperationalCatalogItem[];
}> {
  const [cases, statuses, entities] = await Promise.allSettled([
    queryClient.fetchQuery({ queryKey: caseKey, queryFn: fetchCases, staleTime: 30_000 }),
    queryClient.fetchQuery({ queryKey: statusKey, queryFn: fetchStatuses, staleTime: 30_000 }),
    queryClient.fetchQuery({ queryKey: entitiesKey, queryFn: fetchEntities, staleTime: 30_000 }),
  ]);
  return {
    cases: cases.status === "fulfilled" ? cases.value : [],
    statuses: statuses.status === "fulfilled" ? statuses.value : [],
    entities: entities.status === "fulfilled" ? entities.value : [],
  };
}
