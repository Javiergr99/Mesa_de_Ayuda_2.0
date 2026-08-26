import { Search } from "lucide-react";

import { DatePickerField } from "@/components/ui/date-picker-field";
import { FilterPanel, type ActiveFilterChip } from "@/components/ui/filter-panel";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import {
  ATTENTION_CASE_CATALOG,
  ATTENTION_REGISTRY_CATALOG,
  ATTENTION_STATUS_CATALOG,
} from "@/features/attentions/model/attention.catalogs";
import type {
  AttentionsFilterKey,
  AttentionsFilterState,
} from "@/features/attentions/lib/attentions-filter.utils";
import { catalogToSelectOptions } from "@/shared/catalogs/catalog.types";
import { FEDERAL_ENTITY_CATALOG } from "@/shared/catalogs/federal-entities";

const ENTITY_OPTIONS = catalogToSelectOptions(FEDERAL_ENTITY_CATALOG);

export function AttentionsFilters({
  filters,
  activeFilters,
  maxDate,
  onChange,
  onApply,
  onClear,
}: {
  filters: AttentionsFilterState;
  activeFilters: readonly ActiveFilterChip[];
  maxDate: string;
  onChange: (key: AttentionsFilterKey, value: string) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <FilterPanel activeFilters={activeFilters} onApply={onApply} onClear={onClear}>
      <Input
        label="Búsqueda rápida"
        value={filters.query}
        onChange={(event) => onChange("query", event.target.value)}
        placeholder="Buscar por nombre de la persona atendida..."
        icon={<Search className="h-4 w-4" />}
      />

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectField
          label="Tipo de registro"
          value={filters.registryId}
          onValueChange={(value) => onChange("registryId", value)}
          placeholder="Seleccionar registro"
          options={ATTENTION_REGISTRY_CATALOG.map((item) => ({
            label: item.label,
            value: String(item.id),
          }))}
        />

        <SelectField
          label="Estatus"
          value={filters.statusId}
          onValueChange={(value) => onChange("statusId", value)}
          placeholder="Seleccionar estatus"
          options={ATTENTION_STATUS_CATALOG.map((item) => ({
            label: item.label,
            value: String(item.id),
          }))}
        />

        <SelectField
          label="Estado / PFPNNA"
          value={filters.entityId}
          onValueChange={(value) => onChange("entityId", value)}
          placeholder="Seleccionar estado"
          options={ENTITY_OPTIONS}
        />

        <SelectField
          label="Tipo de atención"
          value={filters.caseTypeId}
          onValueChange={(value) => onChange("caseTypeId", value)}
          placeholder="Seleccionar atención"
          options={ATTENTION_CASE_CATALOG.map((item) => ({
            label: item.label,
            value: String(item.id),
          }))}
        />

        <DatePickerField
          label="Fecha inicial"
          value={filters.startDate}
          onChange={(value) => onChange("startDate", value)}
          maxDate={maxDate}
        />

        <DatePickerField
          label="Fecha final"
          value={filters.endDate}
          onChange={(value) => onChange("endDate", value)}
          maxDate={maxDate}
        />
      </div>
    </FilterPanel>
  );
}
