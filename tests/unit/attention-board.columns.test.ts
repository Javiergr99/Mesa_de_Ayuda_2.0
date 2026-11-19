import { describe, expect, it } from "vitest";

import {
  buildAttentionBoardColumns,
  matchesAttentionBoardColumn,
} from "@/features/attentions/lib/attention-board.columns";

const catalog = [
  { id: 1, clave: "PENDIENTE", nombre: "Pendiente", activo: true, orden: 1 },
  { id: 2, clave: "EN_PROCESO", nombre: "En proceso", activo: true, orden: 2 },
  { id: 7, clave: "ESCALADA", nombre: "Escalada", activo: true, orden: 7 },
  { id: 8, clave: "OBSOLETO", nombre: "Obsoleto", activo: false, orden: 8 },
];

describe("columnas del tablero por estatus", () => {
  it("muestra un estatus nuevo automáticamente sin codificarlo", () => {
    const attentions = [{ statusId: 7, status: "Escalada" }];
    const columns = buildAttentionBoardColumns(catalog, attentions);
    expect(columns.map((column) => column.label)).toEqual(["Pendiente", "En proceso", "Escalada"]);
    expect(matchesAttentionBoardColumn(columns[2]!, attentions[0]!)).toBe(true);
  });

  it("conserva estatus inactivos únicamente si existen atenciones históricas", () => {
    expect(buildAttentionBoardColumns(catalog, []).some((column) => column.statusId === 8)).toBe(false);
    const columns = buildAttentionBoardColumns(catalog, [{ statusId: 8, status: "Obsoleto" }]);
    expect(columns.some((column) => column.statusId === 8)).toBe(true);
  });

  it("no oculta atenciones cuyo estatus aún no aparece en el catálogo", () => {
    const attention = { statusId: 99, status: "En revisión" };
    const columns = buildAttentionBoardColumns(catalog, [attention]);
    expect(columns.some((column) => matchesAttentionBoardColumn(column, attention))).toBe(true);
  });

  it("puede agrupar registros históricos sin identificador", () => {
    const attention = { statusId: null, status: "Sin estatus" };
    const columns = buildAttentionBoardColumns(catalog, [attention]);
    expect(columns.some((column) => matchesAttentionBoardColumn(column, attention))).toBe(true);
  });
});
