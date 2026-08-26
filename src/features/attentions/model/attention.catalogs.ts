import type { NumericCatalogOption } from "@/shared/catalogs/catalog.types";

export type CatalogOption = NumericCatalogOption;

// Catálogos locales provisionales. La API documentada todavía no expone
// endpoints de catálogos; se concentran aquí para sustituirlos sin tocar UI.
export const ATTENTION_STATUS_CATALOG: readonly CatalogOption[] = [
  { id: 1, key: "PENDIENTE", label: "Pendiente" },
  { id: 2, key: "EN_PROCESO", label: "En proceso" },
  { id: 3, key: "ATENDIDA", label: "Atendida" },
  { id: 4, key: "CANCELADA", label: "Cancelada" },
] as const;

export const ATTENTION_CASE_CATALOG: readonly CatalogOption[] = [
  { id: 1, key: "ALTA_USUARIO", label: "Alta de usuario" },
  { id: 2, key: "BAJA_USUARIO", label: "Baja de usuario" },
  { id: 3, key: "ACTUALIZACION_USUARIO", label: "Actualización de usuario" },
  { id: 4, key: "RECUPERACION_PASSWORD", label: "Recuperación de contraseña" },
  { id: 5, key: "CAPACITACION", label: "Capacitación" },
  { id: 6, key: "SOPORTE_TECNICO", label: "Soporte técnico" },
  { id: 7, key: "ORIENTACION_ASESORIA", label: "Orientación / asesoría" },
  { id: 8, key: "OTRO", label: "Otro" },
] as const;

export const ATTENTION_REGISTRY_CATALOG: readonly CatalogOption[] = [
  { id: 1, key: "MP", label: "MP" },
  { id: 2, key: "MH", label: "MH" },
  { id: 3, key: "VF", label: "VF" },
  { id: 4, key: "RNCAS", label: "RNCAS" },
  { id: 5, key: "GENERAL", label: "GENERAL" },
] as const;

export function findCatalogLabel(
  catalog: readonly CatalogOption[],
  id?: number | null,
): string | null {
  if (!id) return null;
  return catalog.find((item) => item.id === id)?.label ?? null;
}
