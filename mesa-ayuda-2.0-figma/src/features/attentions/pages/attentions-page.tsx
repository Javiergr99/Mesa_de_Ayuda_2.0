import { useMemo, useState } from "react";
import { Columns3, Eye, Grid2X2, List, Plus, Search } from "lucide-react";
import { Link } from "react-router";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { Tooltip } from "@/components/ui/tooltip";
import { AttentionReadonlyDrawer } from "@/features/attentions/components/attention-readonly-drawer";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import {
  ATTENTION_STATUS_CATALOG,
} from "@/features/attentions/model/attention.catalogs";
import type { Attention } from "@/features/attentions/model/attention.types";
import { cn } from "@/shared/lib/cn";

const viewOptions = [
  { value: "table", label: "Tabla", icon: List },
  { value: "board", label: "Tablero", icon: Grid2X2 },
] as const;

const ATTENTION_BOARD_STATUSES: Attention["status"][] = [
  "Pendiente",
  "En proceso",
  "Atendida",
  "Cancelada",
];

export function AttentionsPage() {
  const [view, setView] = useState<"table" | "board">("table");
  const [query, setQuery] = useState("");
  const [statusId, setStatusId] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAttention, setSelectedAttention] = useState<Attention | null>(null);

  const params = useMemo(
    () => ({
      nombre: query.trim() || undefined,
      estatus_id: statusId ? Number(statusId) : undefined,
      pagina: page,
      limite: 20,
    }),
    [page, query, statusId],
  );

  const { data, isPending, error } = useAttentions(params);
  const attentions = data?.items ?? [];

  return (
    <div className="app-page">
      <PageHeading
        eyebrow={
          <>
            <span>Dashboard</span> <span className="px-1">›</span>{" "}
            <span className="text-blue-600">Atenciones</span>
          </>
        }
        title="Bitácora de atenciones"
        description="Consulte las bitácoras activas registradas en API Mesa de Ayuda."
        actions={
          <Button asChild>
            <Link to="/app/atenciones/nueva">
              <Plus className="h-4 w-4" /> Registrar atención
            </Link>
          </Button>
        }
      />

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end">
          <Input
            label="Buscar por nombre"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Escriba el nombre de la persona atendida..."
            icon={<Search className="h-4 w-4" />}
          />
          <SelectField
            label="Estatus"
            value={statusId}
            onValueChange={(value) => {
              setStatusId(value);
              setPage(1);
            }}
            placeholder="Todos los estatus"
            options={ATTENTION_STATUS_CATALOG.map((item) => ({
              label: item.label,
              value: String(item.id),
            }))}
          />
          <div className="flex w-fit rounded-lg border border-slate-200 bg-white p-1">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setView(option.value)}
                  className={cn(
                    "focus-ring flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold text-slate-500",
                    view === option.value && "bg-blue-600 text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : "No fue posible consultar la bitácora."}
        </Card>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">
          {(data?.total ?? 0).toLocaleString("es-MX")} atenciones encontradas
        </p>
        <Tooltip content="Las columnas reflejan únicamente campos disponibles en el contrato actual.">
          <Button variant="secondary" size="icon" aria-label="Información de columnas">
            <Columns3 className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>

      {isPending ? (
        <AttentionSkeleton />
      ) : view === "table" ? (
        <AttentionTable attentions={attentions} onView={setSelectedAttention} />
      ) : (
        <AttentionBoard attentions={attentions} onView={setSelectedAttention} />
      )}

      <DataTablePagination
        page={data?.pagina ?? page}
        totalPages={Math.max(data?.total_paginas ?? 1, 1)}
        totalItems={data?.total ?? 0}
        pageSize={data?.limite ?? 20}
        onPageChange={setPage}
      />

      <AttentionReadonlyDrawer
        attention={selectedAttention}
        open={Boolean(selectedAttention)}
        onOpenChange={(open) => !open && setSelectedAttention(null)}
      />
    </div>
  );
}

function AttentionTable({
  attentions,
  onView,
}: {
  attentions: Attention[];
  onView: (attention: Attention) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto app-scrollbar">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
            <tr>
              {["ID", "Persona", "Tipo de caso", "Registro", "Entidad", "Estatus", "Fecha", "Acción"].map(
                (label) => (
                  <th key={label} className="border-b border-slate-200 px-4 py-3">
                    {label}
                  </th>
                ),
              )}
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
                <td className="px-4 py-4 text-sm text-slate-600">{attention.caseType}</td>
                <td className="px-4 py-4 text-sm font-medium text-slate-700">{attention.registry}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{attention.entity}</td>
                <td className="px-4 py-4"><StatusBadge status={attention.status} /></td>
                <td className="px-4 py-4 text-sm text-slate-600">{attention.date}</td>
                <td className="px-4 py-4">
                  <Tooltip content="Ver registro">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onView(attention)}
                      aria-label={`Ver atención ${attention.reference}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </td>
              </tr>
            ))}
            {!attentions.length ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AttentionBoard({
  attentions,
  onView,
}: {
  attentions: Attention[];
  onView: (attention: Attention) => void;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {ATTENTION_BOARD_STATUSES.map((status) => {
        const items = attentions.filter((attention) => attention.status === status);
        return (
          <Card key={status} className="min-h-[360px] bg-slate-50/60 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <StatusBadge status={status} />
              <span className="text-xs font-bold text-slate-500">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((attention) => (
                <m.article
                  key={attention.id}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-200"
                >
                  <p className="text-xs font-bold text-blue-600">{attention.reference}</p>
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{attention.caseType}</h3>
                  <p className="mt-1 text-sm text-slate-600">{attention.requester}</p>
                  <p className="mt-3 text-xs text-slate-500">{attention.registry} · {attention.entity}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">{attention.updatedAt}</span>
                    <Tooltip content="Ver registro">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onView(attention)}
                        aria-label={`Ver atención ${attention.reference}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </m.article>
              ))}
            </div>
          </Card>
        );
        })}
      </div>
    </LazyMotion>
  );
}

function AttentionSkeleton() {
  return (
    <Card className="overflow-hidden p-5">
      <div className="space-y-3">
        {["a", "b", "c", "d"].map((key) => (
          <div key={key} className="relative h-16 overflow-hidden rounded-lg bg-slate-100">
            <span className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        ))}
      </div>
    </Card>
  );
}
