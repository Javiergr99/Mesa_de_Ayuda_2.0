import type { DashboardFilterParams } from "@/features/dashboard/api/dashboard.contracts";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function filtersForPeriod(period: "30" | "90" | "year"): DashboardFilterParams {
  const today = new Date();
  const end = isoDate(today);

  if (period === "year") {
    return {
      fecha_inicio: `${today.getFullYear()}-01-01`,
      fecha_fin: end,
    };
  }

  const start = new Date(today);
  start.setDate(start.getDate() - Number(period) + 1);
  return { fecha_inicio: isoDate(start), fecha_fin: end };
}
