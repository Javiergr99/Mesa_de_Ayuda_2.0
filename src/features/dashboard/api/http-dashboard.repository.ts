import type {
  DashboardByEntityResponse,
  DashboardSummaryResponse,
  DashboardTemporalPoint,
} from "@/features/dashboard/api/dashboard.contracts";
import type { DashboardRepository } from "@/features/dashboard/api/dashboard.repository";
import { mesaAyudaRequest, toSearchParams } from "@/shared/api/mesa-ayuda-api-client";

function query(values: Record<string, string | number | undefined>): string {
  return toSearchParams(values);
}

export const httpDashboardRepository: DashboardRepository = {
  getSummary(params = {}) {
    return mesaAyudaRequest<DashboardSummaryResponse>(`/api/v1/dashboard/resumen${query(params)}`);
  },

  getTemporalSeries(params = {}) {
    return mesaAyudaRequest<DashboardTemporalPoint[]>(
      `/api/v1/dashboard/serie-temporal${query(params)}`,
    );
  },

  getByEntity(params = {}) {
    return mesaAyudaRequest<DashboardByEntityResponse>(
      `/api/v1/dashboard/por-entidad${query(params)}`,
    );
  },
};
