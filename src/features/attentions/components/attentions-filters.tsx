import { Search } from "lucide-react";

import { DatePickerField } from "@/components/ui/date-picker-field";
import { FilterPanel, type ActiveFilterChip } from "@/components/ui/filter-panel";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { operationalOptions, useCaseCatalog, useEntityCatalog, useStatusCatalog } from "@/features/attentions/api/operational-catalogs";
import { registryOptions, useRegistryCatalog } from "@/features/attentions/api/registry-catalog";
import type {
  AttentionsFilterKey,
  AttentionsFilterState,
} from "@/features/attentions/lib/attentions-filter.utils";

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
  const registryCatalog = useRegistryCatalog();
  const casesQuery = useCaseCatalog();
  const statusesQuery = useStatusCatalog();
  const entitiesQuery = useEntityCatalog();

  return (
    <FilterPanel activeFilters={activeFilters} onApply={onApply} onClear={onClear}>
      <Input
        label="Búsqueda rápida"
        value={filters.query}
        onChange={(event) => onChange("query", event.target.value)}
        placeholder="Buscar por nombre de la persona atendida..."
        icon={<Search className="h-4 w-4" />}
      />

      {registryCatalog.isError || casesQuery.isError || statusesQuery.isError || entitiesQuery.isError ? (
        <p role="alert" className="mt-2 text-xs text-red-600">No fue posible cargar alguno de los catálogos de filtros.</p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectField
          label="Tipo de registro"
          value={filters.registryId}
          onValueChange={(value) => onChange("registryId", value)}
          placeholder="Seleccionar registro"
          options={registryOptions(registryCatalog.data ?? [], true)}
        />

        <SelectField
          label="Estatus"
          value={filters.statusId}
          onValueChange={(value) => onChange("statusId", value)}
          placeholder="Seleccionar estatus"
          options={operationalOptions(statusesQuery.data ?? [], true)}
        />

        <SelectField
          label="Estado / PFPNNA"
          value={filters.entityId}
          onValueChange={(value) => onChange("entityId", value)}
          placeholder="Seleccionar estado"
          options={operationalOptions(entitiesQuery.data ?? [], true)}
          disabled={entitiesQuery.isPending || entitiesQuery.isError}
        />

        <SelectField
          label="Tipo de atención"
          value={filters.caseTypeId}
          onValueChange={(value) => onChange("caseTypeId", value)}
          placeholder="Seleccionar atención"
          options={operationalOptions(casesQuery.data ?? [], true)}
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
