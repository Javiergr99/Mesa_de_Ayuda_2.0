import type {
  DashboardStatusItem,
  DashboardSummaryResponse,
} from "@/features/dashboard/api/dashboard.contracts";

/**
 * El Backend regresa todos los estatus activos y los inactivos con registros.
 * Los registros sin estatus no participan en el GROUP BY y se muestran aparte.
 */
export function buildDashboardStatusSlices(summary?: DashboardSummaryResponse): DashboardStatusItem[] {
  if (!summary?.distribucion_estatus) return [];

  const items = [...summary.distribucion_estatus];
  const classified = items.reduce((sum, item) => sum + item.total, 0);
  const unclassified = Math.max(0, summary.total_atenciones - classified);

  if (unclassified > 0) {
    items.push({
      id: 0,
      clave: "SIN_ESTATUS",
      nombre: "Sin estatus",
      total: unclassified,
      porcentaje: summary.total_atenciones > 0
        ? (unclassified / summary.total_atenciones) * 100 : 0,
    });
  }

  return items;
}
