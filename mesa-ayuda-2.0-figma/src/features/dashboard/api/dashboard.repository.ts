import type {
  DashboardByEntityResponse,
  DashboardFilterParams,
  DashboardSummaryResponse,
  DashboardTemporalPoint,
} from "@/features/dashboard/api/dashboard.contracts";

export interface DashboardRepository {
  getSummary(params?: DashboardFilterParams): Promise<DashboardSummaryResponse>;
  getTemporalSeries(
    params?: DashboardFilterParams & { agrupacion?: "dia" | "mes" | "anio" },
  ): Promise<DashboardTemporalPoint[]>;
  getByEntity(params?: DashboardFilterParams): Promise<DashboardByEntityResponse>;
}
