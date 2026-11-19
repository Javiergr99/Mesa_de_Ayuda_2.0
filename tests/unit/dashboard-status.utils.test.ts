import { describe, expect, it } from "vitest";

import type { DashboardSummaryResponse } from "@/features/dashboard/api/dashboard.contracts";
import { buildDashboardStatusSlices } from "@/features/dashboard/lib/dashboard-status.utils";

const summary = {
  total_atenciones: 9,
  pendientes: 3,
  en_proceso: 1,
  atendidas: 2,
  canceladas: 0,
  porcentaje_finalizacion: 22.22,
  promedio_atenciones_por_dia: 0,
  distribucion_estatus: [
    { id: 1, clave: "PENDIENTE", nombre: "Pendiente", total: 3, porcentaje: 33.33 },
    { id: 2, clave: "EN_PROCESO", nombre: "En proceso", total: 1, porcentaje: 11.11 },
    { id: 3, clave: "ATENDIDA", nombre: "Atendida", total: 2, porcentaje: 22.22 },
    { id: 5, clave: "REVISADO", nombre: "Revisado", total: 0, porcentaje: 0 },
    { id: 6, clave: "ESCALADA", nombre: "Escalada", total: 2, porcentaje: 22.22 },
  ],
} satisfies DashboardSummaryResponse;

describe("distribución dinámica de estatus del Dashboard", () => {
  it("incluye estatus nuevos e históricos y los activos sin atenciones", () => {
    const result = buildDashboardStatusSlices(summary);
    expect(result.map(({ clave }) => clave)).toEqual([
      "PENDIENTE", "EN_PROCESO", "ATENDIDA", "REVISADO", "ESCALADA", "SIN_ESTATUS",
    ]);
    expect(result.find((status) => status.clave === "ESCALADA")?.total).toBe(2);
    expect(result.find((status) => status.clave === "REVISADO")?.total).toBe(0);
    expect(result.find((status) => status.clave === "SIN_ESTATUS")?.total).toBe(1);
    expect(result.reduce((sum, status) => sum + status.total, 0)).toBe(9);
  });

  it("no inventa una distribución cuando el Backend todavía no la proporciona", () => {
    const { distribucion_estatus: _omitted, ...legacy } = summary;
    expect(buildDashboardStatusSlices(legacy)).toEqual([]);
  });
});
