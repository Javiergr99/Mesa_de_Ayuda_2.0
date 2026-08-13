import { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  MapPinned,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import {
  useDashboardEntities,
  useDashboardSummary,
  useDashboardTemporal,
} from "@/features/dashboard/api/dashboard.queries";
import type {
  DashboardRankItem,
  DashboardTemporalPoint,
} from "@/features/dashboard/api/dashboard.contracts";
import { filtersForPeriod } from "@/features/dashboard/model/dashboard-filters";

function rankLabel(value?: DashboardRankItem | string | number | null): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString("es-MX");
  return value?.nombre ?? value?.clave ?? "Sin información";
}

function rankTotal(value?: DashboardRankItem | string | number | null): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value) return value.total ?? null;
  return null;
}

function percent(value: number | null | undefined): string {
  return `${Number(value ?? 0).toLocaleString("es-MX", { maximumFractionDigits: 1 })}%`;
}

export function DashboardPage() {
  const [period, setPeriod] = useState<"30" | "90" | "year">("30");
  const filters = useMemo(() => filtersForPeriod(period), [period]);

  const summaryQuery = useDashboardSummary(filters);
  const temporalQuery = useDashboardTemporal(filters, "mes");
  const entitiesQuery = useDashboardEntities(filters);
  const recentQuery = useAttentions({ ...filters, pagina: 1, limite: 5 });

  const summary = summaryQuery.data;
  const isLoading = summaryQuery.isPending || temporalQuery.isPending;
  const error = summaryQuery.error ?? temporalQuery.error ?? entitiesQuery.error;

  return (
    <div className="app-page">
      <PageHeading
        eyebrow={
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Mesa de Ayuda 2.0
          </span>
        }
        title="Panel de control"
        description="Resumen real de la operación e indicadores reportados por API Mesa de Ayuda."
        actions={
          <div className="w-56">
            <SelectField
              label="Periodo"
              value={period}
              onValueChange={(value) => setPeriod(value as "30" | "90" | "year")}
              options={[
                { label: "Últimos 30 días", value: "30" },
                { label: "Últimos 3 meses", value: "90" },
                { label: "Año actual", value: "year" },
              ]}
            />
          </div>
        }
      />

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible consultar los indicadores del dashboard."}
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Atenciones registradas"
          value={isLoading ? "—" : (summary?.total_atenciones ?? 0).toLocaleString("es-MX")}
          detail="Registros activos dentro del periodo"
          icon={ClipboardList}
          tone="blue"
        />
        <StatCard
          title="Pendientes"
          value={isLoading ? "—" : (summary?.pendientes ?? 0).toLocaleString("es-MX")}
          detail="Atenciones pendientes de seguimiento"
          icon={FileText}
          tone="amber"
        />
        <StatCard
          title="Atendidas"
          value={isLoading ? "—" : (summary?.atendidas ?? 0).toLocaleString("es-MX")}
          detail={`${percent(summary?.porcentaje_finalizacion)} de finalización`}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          title="Promedio diario"
          value={isLoading ? "—" : Number(summary?.promedio_atenciones_por_dia ?? 0).toLocaleString("es-MX", { maximumFractionDigits: 1 })}
          detail="Atenciones registradas por día"
          icon={Clock3}
          tone="violet"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-slate-900">
                <TrendingUp className="h-5 w-5 text-blue-600" /> Serie temporal
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Atenciones agrupadas por mes para el periodo seleccionado.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Agrupación: mes</span>
          </div>
          <LineChart points={temporalQuery.data ?? []} />
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            <PieChart className="h-5 w-5 text-violet-600" /> Distribución por estatus
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Estado general de las atenciones del periodo.
          </p>
          <DonutChart
            pending={summary?.pendientes ?? 0}
            inProgress={summary?.en_proceso ?? 0}
            attended={summary?.atendidas ?? 0}
            cancelled={summary?.canceladas ?? 0}
          />
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card className="overflow-x-auto app-scrollbar">
          <div className="min-w-[620px] border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Actividad reciente</h2>
            <p className="mt-1 text-xs text-slate-500">
              Últimas bitácoras activas devueltas por el listado principal.
            </p>
          </div>
          <table className="w-full min-w-[620px]">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-4 py-3">Persona</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {(recentQuery.data?.items ?? []).map((attention) => (
                <tr key={attention.id} className="group border-t border-slate-100">
                  <td className="relative px-5 py-4 text-sm font-bold text-slate-900 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:scale-y-0 before:bg-blue-600 group-hover:text-blue-600 group-hover:before:scale-y-100">
                    {attention.reference}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{attention.requester}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{attention.registry}</td>
                  <td className="px-4 py-4"><StatusBadge status={attention.status} /></td>
                </tr>
              ))}
              {!recentQuery.isPending && !(recentQuery.data?.items.length ?? 0) ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                    No hay atenciones para mostrar en el periodo seleccionado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold text-slate-900">Indicadores operativos</h2>
          <div className="mt-5 space-y-4">
            <IndicatorRow label="Porcentaje de finalización" value={percent(summary?.porcentaje_finalizacion)} />
            <IndicatorRow label="Registro más activo" value={rankLabel(summary?.registro_mas_activo)} />
            <IndicatorRow label="Tipo de caso más frecuente" value={rankLabel(summary?.tipo_caso_mas_frecuente)} />
            <IndicatorRow label="Estado más activo" value={rankLabel(summary?.estado_mas_activo)} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <MapPinned className="h-5 w-5 text-blue-600" />
              <p className="mt-3 text-2xl font-bold">
                {(entitiesQuery.data?.sin_entidad ?? 0).toLocaleString("es-MX")}
              </p>
              <p className="text-xs text-slate-500">Sin entidad</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <Activity className="h-5 w-5 text-violet-600" />
              <p className="mt-3 text-2xl font-bold">
                {(rankTotal(summary?.actividad_institucional_pfpnna) ?? 0).toLocaleString("es-MX")}
              </p>
              <p className="text-xs text-slate-500">Actividad PFPNNA</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function IndicatorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function LineChart({ points }: { points: DashboardTemporalPoint[] }) {
  if (!points.length) {
    return (
      <div className="mt-5 grid h-[270px] place-items-center rounded-xl bg-slate-50 text-sm text-slate-500">
        Sin datos para la serie temporal.
      </div>
    );
  }

  const width = 700;
  const max = Math.max(...points.map((point) => point.total), 1);
  const step = points.length === 1 ? 0 : 660 / (points.length - 1);
  const svgPoints = points
    .map((point, index) => {
      const x = 20 + index * step;
      const y = 220 - (point.total / max) * 170;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <LazyMotion features={domAnimation}>
      <div className="mt-5 overflow-hidden rounded-xl">
        <svg viewBox={`0 0 ${width} 270`} className="w-full" role="img" aria-label="Serie temporal de atenciones">
        {[50, 100, 150, 200].map((y) => (
          <line key={y} x1="20" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeDasharray="4 5" />
        ))}
        <m.polyline
          points={svgPoints}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        {points.map((point, index) => {
          const x = 20 + index * step;
          return (
            <text key={`${point.periodo}-${index}`} x={x} y="260" textAnchor="middle" fontSize="10" fill="#64748b">
              {point.periodo}
            </text>
          );
        })}
        </svg>
      </div>
    </LazyMotion>
  );
}

function DonutChart({
  pending,
  inProgress,
  attended,
  cancelled,
}: {
  pending: number;
  inProgress: number;
  attended: number;
  cancelled: number;
}) {
  const total = pending + inProgress + attended + cancelled;
  const safe = total || 1;
  const a = (attended / safe) * 100;
  const b = a + (inProgress / safe) * 100;
  const c = b + (pending / safe) * 100;

  return (
    <div className="mt-6">
      <div className="relative mx-auto h-52 w-52">
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: `conic-gradient(#10b981 0 ${a}%, #8b5cf6 ${a}% ${b}%, #f59e0b ${b}% ${c}%, #ef4444 ${c}% 100%)`,
          }}
        />
        <div className="absolute inset-10 grid place-items-center rounded-full bg-white text-center shadow-inner">
          <div>
            <p className="text-3xl font-bold">{total.toLocaleString("es-MX")}</p>
            <p className="text-xs text-slate-500">Registros</p>
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {[
          ["Atendidas", attended, "bg-emerald-500"],
          ["En proceso", inProgress, "bg-violet-500"],
          ["Pendientes", pending, "bg-amber-500"],
          ["Canceladas", cancelled, "bg-red-500"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="flex items-center justify-between rounded-lg px-2 py-1.5">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <i className={`h-2.5 w-2.5 rounded-full ${String(color)}`} />
              {label}
            </span>
            <strong className="text-sm">{Number(value).toLocaleString("es-MX")}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
