import type {
  DashboardByEntityResponse,
  DashboardEntityItem,
  DashboardRankItem,
} from "@/features/dashboard/api/dashboard.contracts";

export function formatDashboardNumber(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString("es-MX");
}

export function formatDashboardDecimal(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function formatDashboardPercent(value: number | null | undefined): string {
  return `${formatDashboardDecimal(value)}%`;
}

export function rankLabel(value?: DashboardRankItem | string | number | null): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString("es-MX");
  return value?.nombre ?? value?.clave ?? "Sin información";
}

export function rankTotal(value?: DashboardRankItem | string | number | null): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value) return value.total ?? null;
  return null;
}

function entityName(item: DashboardEntityItem): string {
  return item.entidad ?? item.nombre ?? item.clave ?? "Entidad sin nombre";
}

export type DashboardEntityDisplayItem = {
  id: string;
  label: string;
  total: number;
  percentage: number;
  barPercentage: number;
};

export function getTopDashboardEntities(
  response?: DashboardByEntityResponse,
  limit = 4,
): DashboardEntityDisplayItem[] {
  const items = response?.items ?? response?.entidades ?? [];
  const ordered = [...items]
    .filter((item) => Number.isFinite(item.total) && item.total >= 0)
    .sort((first, second) => second.total - first.total)
    .slice(0, limit);

  const overallTotal = items.reduce(
    (total, item) => total + Math.max(Number(item.total) || 0, 0),
    0,
  );
  const largest = Math.max(...ordered.map((item) => item.total), 1);

  return ordered.map((item, index) => {
    const derivedPercentage = overallTotal > 0 ? (item.total / overallTotal) * 100 : 0;

    return {
      id: String(item.entidad_federativa_id ?? item.clave ?? item.nombre ?? item.entidad ?? index),
      label: entityName(item),
      total: item.total,
      percentage: Number(item.porcentaje ?? derivedPercentage),
      barPercentage: Math.min(100, Math.max(4, (item.total / largest) * 100)),
    };
  });
}
