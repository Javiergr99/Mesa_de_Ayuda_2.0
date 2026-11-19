import type { ActiveFilterChip } from "@/components/ui/filter-panel";
import type { OperationalCatalogItem } from "@/features/attentions/model/operational-catalog.model";
import type { RegistryCatalogItem } from "@/features/attentions/api/registry-catalog";

export type AttentionsFilterState = {
  query: string;
  registryId: string;
  statusId: string;
  entityId: string;
  caseTypeId: string;
  startDate: string;
  endDate: string;
};

export type AttentionsFilterKey = keyof AttentionsFilterState;

export const EMPTY_ATTENTIONS_FILTERS: AttentionsFilterState = {
  query: "",
  registryId: "",
  statusId: "",
  entityId: "",
  caseTypeId: "",
  startDate: "",
  endDate: "",
};


function catalogLabel(
  value: string,
  catalog: readonly { id: number; label: string }[],
): string | null {
  if (!value) return null;

  return catalog.find((item) => String(item.id) === value)?.label ?? null;
}

export function buildAttentionFilterChips(
  filters: AttentionsFilterState,
  onRemove: (key: AttentionsFilterKey) => void,
  registryCatalog: readonly RegistryCatalogItem[] = [],
  casesCatalog: readonly OperationalCatalogItem[] = [],
  statusesCatalog: readonly OperationalCatalogItem[] = [],
  entitiesCatalog: readonly OperationalCatalogItem[] = [],
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.query) {
    chips.push({
      key: "query",
      label: `Búsqueda: ${filters.query}`,
      onRemove: () => onRemove("query"),
    });
  }

  const registry = catalogLabel(
    filters.registryId,
    registryCatalog.map((item) => ({ id: item.id, label: item.clave || item.nombre })),
  );

  if (registry) {
    chips.push({
      key: "registryId",
      label: `Registro: ${registry}`,
      onRemove: () => onRemove("registryId"),
    });
  }

  const status = catalogLabel(
    filters.statusId,
    statusesCatalog.map((item) => ({ id: item.id, label: item.nombre })),
  );

  if (status) {
    chips.push({
      key: "statusId",
      label: `Estatus: ${status}`,
      onRemove: () => onRemove("statusId"),
    });
  }

  const entity = catalogLabel(
    filters.entityId,
    entitiesCatalog.map((item) => ({ id: item.id, label: item.nombre })),
  );

  if (entity) {
    chips.push({
      key: "entityId",
      label: `Estado: ${entity}`,
      onRemove: () => onRemove("entityId"),
    });
  }

  const caseType = catalogLabel(
    filters.caseTypeId,
    casesCatalog.map((item) => ({ id: item.id, label: item.nombre })),
  );

  if (caseType) {
    chips.push({
      key: "caseTypeId",
      label: `Atención: ${caseType}`,
      onRemove: () => onRemove("caseTypeId"),
    });
  }

  if (filters.startDate) {
    chips.push({
      key: "startDate",
      label: `Desde: ${filters.startDate}`,
      onRemove: () => onRemove("startDate"),
    });
  }

  if (filters.endDate) {
    chips.push({
      key: "endDate",
      label: `Hasta: ${filters.endDate}`,
      onRemove: () => onRemove("endDate"),
    });
  }

  return chips;
}
