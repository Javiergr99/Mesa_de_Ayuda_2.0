import { useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { PageHeading } from "@/components/ui/page-heading";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import type { Attention } from "@/features/attentions/model/attention.types";
import { useDashboardSummary } from "@/features/dashboard/api/dashboard.queries";
import { TrackingDrawer } from "@/features/tracking/components/tracking-drawer";
import {
  TrackingFilters,
  TrackingResultsHeader,
  TrackingStatusTabs,
  TrackingSummaryCards,
  TrackingTable,
} from "@/features/tracking/components/tracking-page-sections";

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
    "Referencia",
    "Solicitante",
    "Correo",
    "Registro",
    "Tipo de caso",
    "Estatus",
    "Entidad",
    "Fecha",
    "Ultima actualizacion",
  ];

  const rows = attentions.map((attention) => [
    attention.reference,
    attention.requester,
    attention.email,
    attention.registry,
    attention.caseType,
    attention.status,
    attention.entity,
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
  anchor.download = `seguimiento-atenciones-${getTodayDateInputValue()}.csv`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function TrackingPage() {
  const [query, setQuery] = useState("");
  const [registryId, setRegistryId] = useState("");
  const [caseTypeId, setCaseTypeId] = useState("");
  const [entityId, setEntityId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Attention | null>(null);

  const params = useMemo(
    () => ({
      nombre: query.trim() || undefined,
      tipo_registro_id: registryId ? Number(registryId) : undefined,
      tipo_caso_id: caseTypeId ? Number(caseTypeId) : undefined,
      entidad_federativa_id: entityId ? Number(entityId) : undefined,
      estatus_id: statusId ? Number(statusId) : undefined,
      fecha_inicio: startDate || undefined,
      fecha_fin: endDate || undefined,
      pagina: page,
      limite: 25,
    }),
    [
      caseTypeId,
      endDate,
      entityId,
      page,
      query,
      registryId,
      startDate,
      statusId,
    ],
  );

  const { data, isFetching, error, refetch } = useAttentions(params);
  const summaryQuery = useDashboardSummary({});
  const summary = summaryQuery.data;
  const attentions = data?.items ?? [];

  const activeFilterCount =
    [
      registryId,
      caseTypeId,
      entityId,
      statusId,
      startDate,
      endDate,
    ].filter(Boolean).length + (query.trim() ? 1 : 0);


  function clearFilters() {
    setQuery("");
    setRegistryId("");
    setCaseTypeId("");
    setEntityId("");
    setStatusId("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  return (
    <div className="app-page">
      <PageHeading
        eyebrow={
          <>
            <span>Dashboard</span>{" "}
            <span className="px-1">›</span>{" "}
            <span className="text-blue-600">Seguimiento</span>
          </>
        }
        title="Seguimiento de atenciones"
        description="Consulte los registros capturados y actualice el estatus de cada atención."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => exportCurrentPage(attentions)}
              disabled={!attentions.length}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>

            <Button
              variant="secondary"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Actualizar listado
            </Button>
          </div>
        }
      />

      <TrackingSummaryCards summary={summary} />

      <TrackingStatusTabs
        statusId={statusId}
        summary={summary}
        onChange={(value) => {
          setStatusId(value);
          setPage(1);
        }}
      />

      <TrackingFilters
        filters={{
          query,
          registryId,
          caseTypeId,
          entityId,
          statusId,
          startDate,
          endDate,
        }}
        actions={{
          onQueryChange: (value) => {
            setQuery(value);
            setPage(1);
          },
          onRegistryChange: (value) => {
            setRegistryId(value);
            setPage(1);
          },
          onCaseTypeChange: (value) => {
            setCaseTypeId(value);
            setPage(1);
          },
          onEntityChange: (value) => {
            setEntityId(value);
            setPage(1);
          },
          onStatusChange: (value) => {
            setStatusId(value);
            setPage(1);
          },
          onStartDateChange: (value) => {
            setStartDate(value);
            setPage(1);
          },
          onEndDateChange: (value) => {
            setEndDate(value);
            setPage(1);
          },
          onClear: clearFilters,
          onApply: () => void refetch(),
        }}
        activeFilterCount={activeFilterCount}
        maxDate={getTodayDateInputValue()}
      />

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible consultar el seguimiento."}
        </Card>
      ) : null}

      <TrackingResultsHeader
        total={data?.total ?? 0}
        pageSize={data?.limite ?? 25}
        isFetching={isFetching}
      />

      <TrackingTable
        attentions={attentions}
        isFetching={isFetching}
        onView={setSelected}
      />

      <DataTablePagination
        page={data?.pagina ?? page}
        totalPages={Math.max(data?.total_paginas ?? 1, 1)}
        totalItems={data?.total ?? 0}
        pageSize={data?.limite ?? 25}
        onPageChange={setPage}
      />

      <TrackingDrawer
        attention={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
