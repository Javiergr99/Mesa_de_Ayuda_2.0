import type { OperationalCatalogItem } from "@/features/attentions/model/operational-catalog.model";
import type { Attention } from "@/features/attentions/model/attention.types";

type BoardAttention = Pick<Attention, "status" | "statusId">;

export type AttentionBoardColumn = {
  key: string;
  statusId: number | null;
  label: string;
  markerClassName: string;
  cardClassName: string;
};

const stylesByKey: Record<string, { markerClassName: string; cardClassName: string }> = {
  PENDIENTE: { markerClassName: "bg-amber-500", cardClassName: "border-amber-300" },
  EN_PROCESO: { markerClassName: "bg-violet-500", cardClassName: "border-violet-300" },
  ATENDIDA: { markerClassName: "bg-emerald-500", cardClassName: "border-emerald-300" },
  CANCELADA: { markerClassName: "bg-red-500", cardClassName: "border-red-300" },
};

const defaultStyle = { markerClassName: "bg-slate-500", cardClassName: "border-slate-300" };

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("es-MX");
}

function styleKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function matchesAttentionBoardColumn(
  column: AttentionBoardColumn,
  attention: BoardAttention,
): boolean {
  // El ID es el identificador estable; el nombre solo se usa para registros sin ID.
  if (attention.statusId != null) {
    return column.statusId === attention.statusId;
  }
  return normalize(column.label) === normalize(attention.status);
}

export function buildAttentionBoardColumns(
  catalog: readonly OperationalCatalogItem[],
  attentions: readonly BoardAttention[],
): AttentionBoardColumn[] {
  const columns: AttentionBoardColumn[] = [];
  const seen = new Set<string>();

  function add(statusId: number | null, label: string, code: string): void {
    const key = statusId == null ? `name:${normalize(label)}` : `id:${statusId}`;
    if (seen.has(key)) return;
    seen.add(key);
    columns.push({
      key,
      statusId,
      label,
      ...(stylesByKey[styleKey(code)] ?? defaultStyle),
    });
  }

  for (const item of catalog) {
    // Conservar históricos inactivos solo cuando haya atenciones en la página.
    if (!item.activo && !attentions.some((attention) => attention.statusId === item.id)) {
      continue;
    }
    add(item.id, item.nombre.trim() || item.clave || `Estatus #${item.id}`, item.clave);
  }

  for (const attention of attentions) {
    if (attention.statusId != null) {
      if (seen.has(`id:${attention.statusId}`)) continue;
      const label = attention.status.trim() || `Estatus #${attention.statusId}`;
      add(attention.statusId, label, label);
    } else if (!columns.some((column) => normalize(column.label) === normalize(attention.status))) {
      // Sin ID (incluidos registros históricos): nunca ocultar la atención.
      const label = attention.status.trim() || "Sin estatus";
      add(null, label, label);
    }
  }

  return columns;
}
