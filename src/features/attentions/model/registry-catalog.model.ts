export type RegistryCatalogItem = {
  id: number;
  clave: string;
  nombre: string;
  activo: boolean;
  orden: number;
};

export function registryOptions(
  catalog: readonly RegistryCatalogItem[],
  includeInactive = false,
) {
  return catalog
    .filter((item) => includeInactive || item.activo)
    .map((item) => ({
      label: item.activo ? item.clave : `${item.clave} (inactivo)`,
      value: String(item.id),
    }));
}

export function registryLabel(
  catalog: readonly RegistryCatalogItem[],
  id?: number | null,
): string | null {
  if (id == null) return null;
  const item = catalog.find((option) => option.id === id);
  return item?.clave || item?.nombre || null;
}
