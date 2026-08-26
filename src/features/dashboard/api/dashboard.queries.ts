import { useQuery } from "@tanstack/react-query";

import type { DashboardFilterParams } from "@/features/dashboard/api/dashboard.contracts";
import { httpDashboardRepository } from "@/features/dashboard/api/http-dashboard.repository";

export const dashboardKeys = {
  all: ["mesa-ayuda-dashboard"] as const,
  summary: (params: DashboardFilterParams) => ["mesa-ayuda-dashboard", "summary", params] as const,
  temporal: (params: DashboardFilterParams, agrupacion: "dia" | "mes" | "anio") =>
    ["mesa-ayuda-dashboard", "temporal", params, agrupacion] as const,
  entities: (params: DashboardFilterParams) => ["mesa-ayuda-dashboard", "entities", params] as const,
};

export function useDashboardSummary(params: DashboardFilterParams) {
  return useQuery({
    queryKey: dashboardKeys.summary(params),
    queryFn: () => httpDashboardRepository.getSummary(params),
  });
}

export function useDashboardTemporal(
  params: DashboardFilterParams,
  agrupacion: "dia" | "mes" | "anio" = "mes",
) {
  return useQuery({
    queryKey: dashboardKeys.temporal(params, agrupacion),
    queryFn: () => httpDashboardRepository.getTemporalSeries({ ...params, agrupacion }),
  });
}

export function useDashboardEntities(params: DashboardFilterParams) {
  return useQuery({
    queryKey: dashboardKeys.entities(params),
    queryFn: () => httpDashboardRepository.getByEntity(params),
  });
}
