import { useMemo, useState } from "react";
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
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { StatCard } from "@/components/ui/stat-card";
import { Tooltip } from "@/components/ui/tooltip";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import {
  ATTENTION_REGISTRY_CATALOG,
  ATTENTION_STATUS_CATALOG,
} from "@/features/attentions/model/attention.catalogs";
import type { Attention } from "@/features/attentions/model/attention.types";
import { useDashboardSummary } from "@/features/dashboard/api/dashboard.queries";
import { TrackingDrawer } from "@/features/tracking/components/tracking-drawer";

export function TrackingPage() {
  const [query, setQuery] = useState("");
  const [registryId, setRegistryId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Attention | null>(null);

  const params = useMemo(
    () => ({
      nombre: query.trim() || undefined,
      tipo_registro_id: registryId ? Number(registryId) : undefined,
      estatus_id: statusId ? Number(statusId) : undefined,
      pagina: page,
      limite: 25,
    }),
    [page, query, registryId, statusId],
  );

  const { data, isFetching, error, refetch } = useAttentions(params);
  const summaryQuery = useDashboardSummary({});
  const summary = summaryQuery.data;
  const attentions = data?.items ?? [];

  return (
    <div className="app-page">
      <PageHeading
        eyebrow={
          <>
            <span>Dashboard</span> <span className="px-1">›</span>{" "}
            <span className="text-blue-600">Seguimiento</span>
          </>
        }
        title="Seguimiento de atenciones"
        description="Consulte y actualice los campos permitidos por el contrato de la bitácora."
        actions={
          <Button variant="secondary" onClick={() => void refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Actualizar listado
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total" value={(summary?.total_atenciones ?? 0).toLocaleString("es-MX")} detail="Atenciones activas" icon={ClipboardList} tone="blue" />
        <StatCard title="Pendientes" value={(summary?.pendientes ?? 0).toLocaleString("es-MX")} detail="Sin concluir" icon={Timer} tone="amber" />
        <StatCard title="En proceso" value={(summary?.en_proceso ?? 0).toLocaleString("es-MX")} detail="Actualmente atendidas" icon={Waves} tone="violet" />
        <StatCard title="Atendidas" value={(summary?.atendidas ?? 0).toLocaleString("es-MX")} detail="Concluidas" icon={CircleCheck} tone="emerald" />
        <StatCard title="Canceladas" value={(summary?.canceladas ?? 0).toLocaleString("es-MX")} detail="Retiradas de operación" icon={XCircle} tone="slate" />
      </div>

      <Card className="p-6">
        <Input
          label="Buscar por nombre"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nombre de la persona atendida..."
          icon={<Search className="h-4 w-4" />}
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectField
            label="Tipo de registro"
            value={registryId}
            onValueChange={(value) => {
              setRegistryId(value);
              setPage(1);
            }}
            placeholder="Todos los registros"
            options={ATTENTION_REGISTRY_CATALOG.map((item) => ({ label: item.label, value: String(item.id) }))}
          />
          <SelectField
            label="Estatus"
            value={statusId}
            onValueChange={(value) => {
              setStatusId(value);
              setPage(1);
            }}
            placeholder="Todos los estatus"
            options={ATTENTION_STATUS_CATALOG.map((item) => ({ label: item.label, value: String(item.id) }))}
          />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setRegistryId("");
              setStatusId("");
              setQuery("");
              setPage(1);
            }}
          >
            Limpiar filtros
          </Button>
          <Button onClick={() => void refetch()}>
            <ListFilter className="h-4 w-4" /> Aplicar filtros
          </Button>
        </div>
      </Card>

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : "No fue posible consultar el seguimiento."}
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-900">
          {(data?.total ?? 0).toLocaleString("es-MX")} atenciones encontradas
        </p>
      </div>

      <Card className="overflow-x-auto app-scrollbar">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
            <tr>
              {["ID", "Solicitante", "Registro", "Caso", "Estatus", "Actualización", "Acción"].map((label) => (
                <th key={label} className="border-b border-slate-200 px-4 py-3">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attentions.map((attention) => (
              <tr key={attention.id} className="group border-b border-slate-100 last:border-0">
                <td className="relative px-4 py-4 text-sm font-bold text-slate-900 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:scale-y-95 before:rounded-r before:bg-blue-600 before:opacity-0 before:transition-[transform,opacity] group-hover:text-blue-600 group-hover:before:scale-y-100 group-hover:before:opacity-100">
                  {attention.reference}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-800">{attention.requester}</p>
                  <p className="max-w-48 truncate text-xs text-slate-400">{attention.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{attention.registry}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{attention.caseType}</td>
                <td className="px-4 py-4"><StatusBadge status={attention.status} /></td>
                <td className="px-4 py-4 text-sm text-slate-700">{attention.updatedAt}</td>
                <td className="px-4 py-4">
                  <Tooltip content="Ver y actualizar seguimiento">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setSelected(attention)}
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
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>

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
