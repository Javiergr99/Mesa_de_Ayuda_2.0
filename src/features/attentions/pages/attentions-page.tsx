import { useMemo, useState } from "react";
import { ClipboardList, Download, Plus, RefreshCw, SearchX, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { AttentionsFilters } from "@/features/attentions/components/attentions-filters";
import {
  AttentionBoard,
  AttentionSkeleton,
  AttentionTable,
  AttentionsResultsToolbar,
  AttentionsSummaryCards,
  type AttentionsViewMode,
} from "@/features/attentions/components/attentions-results";
import {
  EMPTY_ATTENTIONS_FILTERS,
  buildAttentionFilterChips,
  type AttentionsFilterKey,
  type AttentionsFilterState,
} from "@/features/attentions/lib/attentions-filter.utils";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import type { Attention } from "@/features/attentions/model/attention.types";
import { useDashboardSummary } from "@/features/dashboard/api/dashboard.queries";

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function exportCurrentPage(attentions: Attention[]) {
  const headers = [
    "Folio",
    "Solicitante",
    "Correo",
    "Tipo de atención",
    "Registro",
    "Estado",
    "Estatus",
    "Fecha",
    "Última actualización",
  ];

  const rows = attentions.map((attention) => [
    attention.reference,
    attention.requester,
    attention.email,
    attention.caseType,
    attention.registry,
    attention.entity,
    attention.status,
    attention.date,
    attention.updatedAt,
  ]);

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `atenciones-${getTodayDateInputValue()}.csv`;
  anchor.click();

  URL.revokeObjectURL(url);
}

function hasFilters(filters: AttentionsFilterState): boolean {
  return Object.values(filters).some((value) => Boolean(value));
}

export function AttentionsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<AttentionsViewMode>("table");
  const [draftFilters, setDraftFilters] = useState<AttentionsFilterState>({
    ...EMPTY_ATTENTIONS_FILTERS,
  });
  const [appliedFilters, setAppliedFilters] = useState<AttentionsFilterState>({
    ...EMPTY_ATTENTIONS_FILTERS,
  });
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      nombre: appliedFilters.query.trim() || undefined,
      tipo_registro_id: appliedFilters.registryId ? Number(appliedFilters.registryId) : undefined,
      estatus_id: appliedFilters.statusId ? Number(appliedFilters.statusId) : undefined,
      entidad_federativa_id: appliedFilters.entityId ? Number(appliedFilters.entityId) : undefined,
      tipo_caso_id: appliedFilters.caseTypeId ? Number(appliedFilters.caseTypeId) : undefined,
      fecha_inicio: appliedFilters.startDate || undefined,
      fecha_fin: appliedFilters.endDate || undefined,
      pagina: page,
      limite: 25,
    }),
    [appliedFilters, page],
  );

  const attentionsQuery = useAttentions(params);
  const summaryQuery = useDashboardSummary({});
  const data = attentionsQuery.data;
  const attentions = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasActiveFilters = hasFilters(appliedFilters);

  function openAttention(attention: Attention) {
    void navigate(`/app/atenciones/${encodeURIComponent(attention.id)}`, {
      state: { attention },
    });
  }

  function updateDraftFilter(key: AttentionsFilterKey, value: string) {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function applyFilters() {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  }

  function clearFilters() {
    setDraftFilters({ ...EMPTY_ATTENTIONS_FILTERS });
    setAppliedFilters({ ...EMPTY_ATTENTIONS_FILTERS });
    setPage(1);
  }

  function removeFilter(key: AttentionsFilterKey) {
    setDraftFilters((current) => ({
      ...current,
      [key]: "",
    }));
    setAppliedFilters((current) => ({
      ...current,
      [key]: "",
    }));
    setPage(1);
  }

  const activeFilterChips = buildAttentionFilterChips(appliedFilters, removeFilter);

  const heading = (
    <PageHeading
      eyebrow={
        <>
          <span>Dashboard</span> <span className="px-1">›</span>{" "}
          <span className="text-blue-600">Atenciones</span>
        </>
      }
      title="Atenciones"
      description="Consulte la información general de las atenciones registradas en Mesa de Ayuda."
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => exportCurrentPage(attentions)}
            disabled={!attentions.length}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          <Button asChild>
            <Link to="/app/atenciones/nueva">
              <Plus className="h-4 w-4" />
              Registrar atención
            </Link>
          </Button>
        </>
      }
    />
  );

  if (attentionsQuery.error && !data) {
    return (
      <div className="app-page">
        {heading}

        <Card>
          <EmptyState
            icon={XCircle}
            title="No fue posible cargar las atenciones"
            description="Ocurrió un problema al consultar la información de la Mesa de Ayuda."
            tone="red"
            size="lg"
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => void attentionsQuery.refetch()}>
                  <RefreshCw className="h-4 w-4" />
                  Reintentar
                </Button>

                <Button variant="secondary" asChild>
                  <Link to="/app/dashboard">Volver al Dashboard</Link>
                </Button>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="app-page">
      {heading}

      <AttentionsSummaryCards summary={summaryQuery.data} fallbackTotal={total} />

      <AttentionsFilters
        filters={draftFilters}
        activeFilters={activeFilterChips}
        maxDate={getTodayDateInputValue()}
        onChange={updateDraftFilter}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {attentionsQuery.isPending ? (
        <AttentionSkeleton />
      ) : total === 0 ? (
        <Card>
          {hasActiveFilters ? (
            <EmptyState
              icon={SearchX}
              title="No se encontraron atenciones"
              description="Cambie los filtros o el término de búsqueda para consultar otros registros."
              tone="slate"
              size="lg"
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No hay atenciones registradas"
              description="Las atenciones capturadas aparecerán en esta sección."
              size="lg"
              action={
                <Button asChild>
                  <Link to="/app/atenciones/nueva">
                    <Plus className="h-4 w-4" />
                    Registrar atención
                  </Link>
                </Button>
              }
            />
          )}
        </Card>
      ) : (
        <>
          <AttentionsResultsToolbar
            total={total}
            pageSize={data?.limite ?? 25}
            view={view}
            onViewChange={setView}
          />

          {view === "table" ? (
            <AttentionTable attentions={attentions} onView={openAttention} />
          ) : (
            <AttentionBoard attentions={attentions} onView={openAttention} />
          )}

          <DataTablePagination
            page={data?.pagina ?? page}
            totalPages={Math.max(data?.total_paginas ?? 1, 1)}
            totalItems={total}
            pageSize={data?.limite ?? 25}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
