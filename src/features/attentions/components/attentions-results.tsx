import { Eye, Grid2X2, List } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import {
  ViewModeToggle,
  type ViewModeOption,
} from "@/components/ui/view-mode-toggle";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import type { Attention } from "@/features/attentions/model/attention.types";
import type { DashboardSummaryResponse } from "@/features/dashboard/api/dashboard.contracts";
import { StatCard } from "@/components/ui/stat-card";
import {
  CircleCheck,
  ClipboardList,
  Clock3,
  Waves,
  XCircle,
} from "lucide-react";

export type AttentionsViewMode = "table" | "board";

const VIEW_OPTIONS: readonly ViewModeOption<AttentionsViewMode>[] = [
  { value: "table", label: "Tabla", icon: List },
  { value: "board", label: "Tablero", icon: Grid2X2 },
];

const BOARD_COLUMNS: readonly {
  status: Attention["status"];
  label: string;
  markerClassName: string;
  cardClassName: string;
}[] = [
  {
    status: "Pendiente",
    label: "Pendientes",
    markerClassName: "bg-amber-500",
    cardClassName: "border-amber-300",
  },
  {
    status: "En proceso",
    label: "En proceso",
    markerClassName: "bg-violet-500",
    cardClassName: "border-violet-300",
  },
  {
    status: "Atendida",
    label: "Finalizadas",
    markerClassName: "bg-emerald-500",
    cardClassName: "border-emerald-300",
  },
  {
    status: "Cancelada",
    label: "Canceladas",
    markerClassName: "bg-red-500",
    cardClassName: "border-red-300",
  },
];

export function AttentionsSummaryCards({
  summary,
  fallbackTotal = 0,
}: {
  summary?: DashboardSummaryResponse;
  fallbackTotal?: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Total de atenciones"
        value={(summary?.total_atenciones ?? fallbackTotal).toLocaleString(
          "es-MX",
        )}
        detail="Registros acumulados"
        icon={ClipboardList}
        tone="blue"
      />
      <StatCard
        title="Pendientes"
        value={(summary?.pendientes ?? 0).toLocaleString("es-MX")}
        detail="Atenciones pendientes"
        icon={Clock3}
        tone="amber"
      />
      <StatCard
        title="En proceso"
        value={(summary?.en_proceso ?? 0).toLocaleString("es-MX")}
        detail="Atenciones en curso"
        icon={Waves}
        tone="violet"
      />
      <StatCard
        title="Finalizadas"
        value={(summary?.atendidas ?? 0).toLocaleString("es-MX")}
        detail="Atenciones concluidas"
        icon={CircleCheck}
        tone="emerald"
      />
      <StatCard
        title="Canceladas"
        value={(summary?.canceladas ?? 0).toLocaleString("es-MX")}
        detail="Atenciones canceladas"
        icon={XCircle}
        tone="red"
      />
    </div>
  );
}

export function AttentionsResultsToolbar({
  total,
  pageSize,
  view,
  onViewChange,
}: {
  total: number;
  pageSize: number;
  view: AttentionsViewMode;
  onViewChange: (value: AttentionsViewMode) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-bold text-slate-900">
          {total.toLocaleString("es-MX")} atenciones encontradas
        </p>

        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
          {pageSize} por página
        </span>
      </div>

      <ViewModeToggle
        value={view}
        options={VIEW_OPTIONS}
        onValueChange={onViewChange}
        ariaLabel="Cambiar vista de atenciones"
      />
    </div>
  );
}

export function AttentionTable({
  attentions,
  onView,
}: {
  attentions: Attention[];
  onView: (attention: Attention) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto app-scrollbar">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead className="bg-slate-50/90 text-left text-xs font-semibold text-slate-500">
            <tr>
              {[
                "Folio",
                "Solicitante",
                "Tipo de atención",
                "Registro",
                "Estado",
                "Estatus",
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
                className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/55"
              >
                <td className="px-4 py-4 text-sm font-bold text-blue-600">
                  {attention.reference}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {attention.requester}
                  </p>
                  <p className="max-w-52 truncate text-xs text-slate-400">
                    {attention.email}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {attention.caseType}
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                  {attention.registry}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {attention.entity}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={attention.status} />
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {attention.updatedAt}
                </td>
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
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function AttentionBoard({
  attentions,
  onView,
}: {
  attentions: Attention[];
  onView: (attention: Attention) => void;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="grid gap-3 xl:grid-cols-4">
        {BOARD_COLUMNS.map((column) => {
          const items = attentions.filter(
            (attention) => attention.status === column.status,
          );

          return (
            <Card
              key={column.status}
              className="min-h-[460px] bg-slate-50/60 p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${column.markerClassName}`}
                  />
                  <h3 className="text-sm font-bold text-slate-800">
                    {column.label}
                  </h3>
                </div>

                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-500 shadow-sm">
                  {items.length}
                </span>
              </div>

              {items.length ? (
                <div className="space-y-3">
                  {items.map((attention) => (
                    <m.article
                      key={attention.id}
                      whileHover={{ y: -2 }}
                      className={`rounded-xl border bg-white p-4 shadow-sm ${column.cardClassName}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-blue-600">
                          {attention.reference}
                        </p>
                        <StatusBadge status={attention.status} />
                      </div>

                      <h4 className="mt-3 text-sm font-bold leading-5 text-slate-900">
                        {attention.caseType}
                      </h4>

                      <p className="mt-1 text-sm text-slate-700">
                        {attention.requester}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        {attention.registry} · {attention.entity}
                      </p>

                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                        <span className="text-[11px] leading-4 text-slate-400">
                          Actualizada:
                          <br />
                          {attention.updatedAt}
                        </span>

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
              ) : (
                <p className="pt-2 text-center text-xs text-slate-400">
                  Sin atenciones
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </LazyMotion>
  );
}

export function AttentionSkeleton() {
  return (
    <Card className="overflow-hidden p-5">
      <div className="space-y-3">
        {["a", "b", "c", "d"].map((key) => (
          <div
            key={key}
            className="relative h-16 overflow-hidden rounded-lg bg-slate-100"
          >
            <span className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        ))}
      </div>
    </Card>
  );
}
