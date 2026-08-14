import {
  CircleCheck,
  ClipboardList,
  Eye,
  ListFilter,
  RefreshCw,
  Search,
  Timer,
  Waves,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { StatCard } from "@/components/ui/stat-card";
import { Tooltip } from "@/components/ui/tooltip";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import {
  ATTENTION_CASE_CATALOG,
  ATTENTION_REGISTRY_CATALOG,
  ATTENTION_STATUS_CATALOG,
} from "@/features/attentions/model/attention.catalogs";
import type { Attention } from "@/features/attentions/model/attention.types";
import type { DashboardSummaryResponse } from "@/features/dashboard/api/dashboard.contracts";
import { catalogToSelectOptions } from "@/shared/catalogs/catalog.types";
import { FEDERAL_ENTITY_CATALOG } from "@/shared/catalogs/federal-entities";

const ENTITY_OPTIONS = catalogToSelectOptions(FEDERAL_ENTITY_CATALOG);

const STATUS_TABS = [
  { value: "", label: "Todos" },
  { value: "1", label: "Pendientes" },
  { value: "2", label: "En proceso" },
  { value: "3", label: "Atendidas" },
  { value: "4", label: "Canceladas" },
] as const;

export type TrackingFilterValues = {
  query: string;
  registryId: string;
  caseTypeId: string;
  entityId: string;
  statusId: string;
  startDate: string;
  endDate: string;
};

export type TrackingFilterActions = {
  onQueryChange: (value: string) => void;
  onRegistryChange: (value: string) => void;
  onCaseTypeChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
  onApply: () => void;
};

export function TrackingSummaryCards({
  summary,
}: {
  summary?: DashboardSummaryResponse;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Total en seguimiento"
        value={(summary?.total_atenciones ?? 0).toLocaleString("es-MX")}
        detail="Atenciones registradas"
        icon={ClipboardList}
        tone="blue"
      />
      <StatCard
        title="Pendientes"
        value={(summary?.pendientes ?? 0).toLocaleString("es-MX")}
        detail="Sin concluir"
        icon={Timer}
        tone="amber"
      />
      <StatCard
        title="En proceso"
        value={(summary?.en_proceso ?? 0).toLocaleString("es-MX")}
        detail="Actualmente atendidas"
        icon={Waves}
        tone="violet"
      />
      <StatCard
        title="Atendidas"
        value={(summary?.atendidas ?? 0).toLocaleString("es-MX")}
        detail="Concluidas"
        icon={CircleCheck}
        tone="emerald"
      />
      <StatCard
        title="Canceladas"
        value={(summary?.canceladas ?? 0).toLocaleString("es-MX")}
        detail="Retiradas de operación"
        icon={XCircle}
        tone="slate"
      />
    </div>
  );
}

export function TrackingStatusTabs({
  statusId,
  summary,
  onChange,
}: {
  statusId: string;
  summary?: DashboardSummaryResponse;
  onChange: (value: string) => void;
}) {
  const counts: Record<string, number> = {
    "": summary?.total_atenciones ?? 0,
    "1": summary?.pendientes ?? 0,
    "2": summary?.en_proceso ?? 0,
    "3": summary?.atendidas ?? 0,
    "4": summary?.canceladas ?? 0,
  };

  return (
    <div className="flex overflow-x-auto border-b border-slate-200 app-scrollbar">
      {STATUS_TABS.map((tab) => {
        const active = statusId === tab.value;

        return (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => onChange(tab.value)}
            className={[
              "relative min-h-12 shrink-0 px-4 text-sm font-semibold transition-colors",
              active
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800",
            ].join(" ")}
          >
            <span>{tab.label}</span>
            <span className="ml-2 text-xs font-bold">
              {(counts[tab.value] ?? 0).toLocaleString("es-MX")}
            </span>
            {active ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TrackingFilters({
  filters,
  actions,
  activeFilterCount,
  maxDate,
}: {
  filters: TrackingFilterValues;
  actions: TrackingFilterActions;
  activeFilterCount: number;
  maxDate: string;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <Input
        label="Búsqueda rápida"
        value={filters.query}
        onChange={(event) => actions.onQueryChange(event.target.value)}
        placeholder="Buscar por nombre de la persona atendida..."
        icon={<Search className="h-4 w-4" />}
      />

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectField
          label="Tipo de registro"
          value={filters.registryId}
          onValueChange={actions.onRegistryChange}
          placeholder="Seleccionar registro"
          options={ATTENTION_REGISTRY_CATALOG.map((item) => ({
            label: item.label,
            value: String(item.id),
          }))}
        />

        <SelectField
          label="Tipo de caso"
          value={filters.caseTypeId}
          onValueChange={actions.onCaseTypeChange}
          placeholder="Seleccionar tipo de caso"
          options={ATTENTION_CASE_CATALOG.map((item) => ({
            label: item.label,
            value: String(item.id),
          }))}
        />

        <SelectField
          label="Entidad federativa / PFPNNA"
          value={filters.entityId}
          onValueChange={actions.onEntityChange}
          placeholder="Seleccionar entidad"
          options={ENTITY_OPTIONS}
        />

        <SelectField
          label="Estatus"
          value={filters.statusId}
          onValueChange={actions.onStatusChange}
          placeholder="Seleccionar estatus"
          options={ATTENTION_STATUS_CATALOG.map((item) => ({
            label: item.label,
            value: String(item.id),
          }))}
        />

        <DatePickerField
          label="Fecha inicial"
          value={filters.startDate}
          onChange={actions.onStartDateChange}
          maxDate={maxDate}
        />

        <DatePickerField
          label="Fecha final"
          value={filters.endDate}
          onChange={actions.onEndDateChange}
          maxDate={maxDate}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-slate-500">
          Filtros activos:{" "}
          <span className="text-slate-800">{activeFilterCount}</span>
        </p>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={actions.onClear}>
            Limpiar filtros
          </Button>
          <Button onClick={actions.onApply}>
            <ListFilter className="h-4 w-4" />
            Aplicar filtros
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function TrackingResultsHeader({
  total,
  pageSize,
  isFetching,
}: {
  total: number;
  pageSize: number;
  isFetching: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-bold text-slate-900">
          {total.toLocaleString("es-MX")} atenciones encontradas
        </p>
        <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
          {pageSize} por página
        </span>
      </div>

      {isFetching ? (
        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Actualizando…
        </span>
      ) : null}
    </div>
  );
}

export function TrackingTable({
  attentions,
  isFetching,
  onView,
}: {
  attentions: Attention[];
  isFetching: boolean;
  onView: (attention: Attention) => void;
}) {
  return (
    <Card className="overflow-x-auto app-scrollbar">
      <table className="w-full min-w-[980px] border-collapse">
        <thead className="bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
          <tr>
            {[
              "Referencia",
              "Solicitante",
              "Registro",
              "Tipo de caso",
              "Estatus",
              "Entidad",
              "Actualización",
              "Acción",
            ].map((label) => (
              <th
                key={label}
                className="border-b border-slate-200 px-4 py-3"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {attentions.map((attention) => (
            <tr
              key={attention.id}
              className="group border-b border-slate-100 last:border-0"
            >
              <td className="relative px-4 py-4 text-sm font-bold text-slate-900 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:scale-y-95 before:rounded-r before:bg-blue-600 before:opacity-0 before:transition-[transform,opacity] group-hover:text-blue-600 group-hover:before:scale-y-100 group-hover:before:opacity-100">
                {attention.reference}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-slate-800">
                  {attention.requester}
                </p>
                <p className="max-w-48 truncate text-xs text-slate-400">
                  {attention.email}
                </p>
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">
                {attention.registry}
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">
                {attention.caseType}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={attention.status} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">
                {attention.entity}
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">
                {attention.updatedAt}
              </td>
              <td className="px-4 py-4">
                <Tooltip content="Ver y actualizar seguimiento">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onView(attention)}
                    aria-label={`Ver seguimiento ${attention.reference}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}

          {!isFetching && !attentions.length ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-sm text-slate-500"
              >
                No hay registros que coincidan con los filtros.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </Card>
  );
}
