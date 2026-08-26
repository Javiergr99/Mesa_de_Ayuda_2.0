import type { ActiveFilterChip } from "@/components/ui/filter-panel";
import {
  ATTENTION_CASE_CATALOG,
  ATTENTION_REGISTRY_CATALOG,
  ATTENTION_STATUS_CATALOG,
} from "@/features/attentions/model/attention.catalogs";
import { catalogToSelectOptions } from "@/shared/catalogs/catalog.types";
import { FEDERAL_ENTITY_CATALOG } from "@/shared/catalogs/federal-entities";

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

const ENTITY_OPTIONS = catalogToSelectOptions(FEDERAL_ENTITY_CATALOG);

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
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.query) {
    chips.push({
      key: "query",
      label: `Búsqueda: ${filters.query}`,
      onRemove: () => onRemove("query"),
    });
  }

  const registry = catalogLabel(filters.registryId, ATTENTION_REGISTRY_CATALOG);

  if (registry) {
    chips.push({
      key: "registryId",
      label: `Registro: ${registry}`,
      onRemove: () => onRemove("registryId"),
    });
  }

  const status = catalogLabel(filters.statusId, ATTENTION_STATUS_CATALOG);

  if (status) {
    chips.push({
      key: "statusId",
      label: `Estatus: ${status}`,
      onRemove: () => onRemove("statusId"),
    });
  }

  const entity = ENTITY_OPTIONS.find((item) => item.value === filters.entityId)?.label ?? null;

  if (entity) {
    chips.push({
      key: "entityId",
      label: `Estado: ${entity}`,
      onRemove: () => onRemove("entityId"),
    });
  }

  const caseType = catalogLabel(filters.caseTypeId, ATTENTION_CASE_CATALOG);

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
