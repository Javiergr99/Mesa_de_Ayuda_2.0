export type OperationalCatalogItem = {
  id: number;
  clave: string;
  nombre: string;
  activo: boolean;
  orden: number;
};

export function operationalOptions(
  catalog: readonly OperationalCatalogItem[],
  includeInactive = false,
) {
  return catalog
    .filter((item) => includeInactive || item.activo)
    .map((item) => ({
      value: String(item.id),
      label: item.activo ? item.nombre : `${item.nombre} (inactivo)`,
    }));
}

export function operationalLabel(
  catalog: readonly OperationalCatalogItem[],
  id?: number | null,
): string | null {
  if (id == null) return null;
  return catalog.find((item) => item.id === id)?.nombre ?? null;
}
