import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Gauge,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import {
  useDashboardEntities,
  useDashboardSummary,
  useDashboardTemporal,
} from "@/features/dashboard/api/dashboard.queries";
import {
  DashboardActivityChart,
  DashboardStatusDistribution,
} from "@/features/dashboard/components/dashboard-charts";
import { DashboardMetricCard } from "@/features/dashboard/components/dashboard-metric-card";
import {
  DashboardOperationalIndicators,
  DashboardTerritorialActivity,
} from "@/features/dashboard/components/dashboard-operational-panels";
import { DashboardRecentTable } from "@/features/dashboard/components/dashboard-recent-table";
import {
  formatDashboardDecimal,
  formatDashboardNumber,
  formatDashboardPercent,
} from "@/features/dashboard/lib/dashboard-display.utils";
import { filtersForPeriod } from "@/features/dashboard/model/dashboard-filters";

type DashboardPeriod = "30" | "90" | "year";

const periodOptions = [
  { label: "Últimos 30 días", value: "30" },
  { label: "Últimos 3 meses", value: "90" },
  { label: "Año actual", value: "year" },
];

export function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>("30");
  const filters = useMemo(() => filtersForPeriod(period), [period]);

  const summaryQuery = useDashboardSummary(filters);
  const temporalQuery = useDashboardTemporal(filters, "mes");
  const entitiesQuery = useDashboardEntities(filters);
  const recentQuery = useAttentions({
    ...filters,
    pagina: 1,
    limite: 5,
  });

  const summary = summaryQuery.data;
  const error =
    summaryQuery.error ??
    temporalQuery.error ??
    entitiesQuery.error ??
    recentQuery.error;
  const isRefreshing =
    summaryQuery.isFetching ||
    temporalQuery.isFetching ||
    entitiesQuery.isFetching ||
    recentQuery.isFetching;

  async function refreshDashboard() {
    await Promise.all([
      summaryQuery.refetch(),
      temporalQuery.refetch(),
      entitiesQuery.refetch(),
      recentQuery.refetch(),
    ]);
  }

  return (
    <div className="app-page">
      <PageHeading
        eyebrow={
          <>
            <span>Dashboard</span>
            <span className="px-1">›</span>
            <span className="text-blue-600">Resumen general</span>
          </>
        }
        title="Dashboard"
        description="Visualice el resumen general de la operación y actividad de Mesa de Ayuda."
        actions={
          <div className="flex flex-wrap items-end justify-end gap-2">
            <div className="flex min-h-10 items-center rounded-lg border border-slate-200 bg-white pl-3 shadow-sm">
              <span className="whitespace-nowrap text-[11px] text-slate-500">
                Periodo:
              </span>
              <div className="w-[170px]">
                <SelectField
                  value={period}
                  onValueChange={(value) => setPeriod(value as DashboardPeriod)}
                  options={periodOptions}
                  placeholder="Periodo del dashboard"
                  triggerClassName="h-9 border-0 bg-transparent px-2 text-[11px] font-bold shadow-none hover:border-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => void refreshDashboard()}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Actualizar
            </Button>
          </div>
        }
      />

      {error ? (
        <Card
          role="alert"
          className="border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error instanceof Error
            ? error.message
            : "No fue posible consultar todos los indicadores del dashboard."}
        </Card>
      ) : null}

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Resumen de indicadores"
      >
        <DashboardMetricCard
          title="Atenciones registradas"
          value={
            summaryQuery.isPending
              ? "—"
              : formatDashboardNumber(summary?.total_atenciones)
          }
          detail={`Promedio diario: ${formatDashboardDecimal(
            summary?.promedio_atenciones_por_dia,
          )}`}
          icon={ClipboardList}
          tone="blue"
        />
        <DashboardMetricCard
          title="Atenciones pendientes"
          value={
            summaryQuery.isPending
              ? "—"
              : formatDashboardNumber(summary?.pendientes)
          }
          detail={`${formatDashboardNumber(
            summary?.en_proceso,
          )} actualmente en proceso`}
          icon={Clock3}
          tone="amber"
        />
        <DashboardMetricCard
          title="Atenciones finalizadas"
          value={
            summaryQuery.isPending
              ? "—"
              : formatDashboardNumber(summary?.atendidas)
          }
          detail={`${formatDashboardPercent(
            summary?.porcentaje_finalizacion,
          )} de resolución general`}
          icon={CheckCircle2}
          tone="emerald"
        />
        <DashboardMetricCard
          title="Promedio diario"
          value={
            summaryQuery.isPending
              ? "—"
              : formatDashboardDecimal(summary?.promedio_atenciones_por_dia)
          }
          detail={`${formatDashboardNumber(
            summary?.canceladas,
          )} registros cancelados`}
          icon={Gauge}
          tone="violet"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <Card className="min-w-0 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">
                Actividad mensual
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Volumen de atenciones registradas durante el periodo seleccionado.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <span
                className="h-2 w-2 rounded-sm bg-blue-600"
                aria-hidden="true"
              />
              Atenciones
            </span>
          </div>

          <div className="overflow-x-auto app-scrollbar">
            <DashboardActivityChart
              points={temporalQuery.data ?? []}
              loading={temporalQuery.isPending}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div>
            <h2 className="text-[14px] font-bold text-slate-900">
              Distribución por estatus
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Estado general de las atenciones registradas.
            </p>
          </div>

          <DashboardStatusDistribution
            pending={summary?.pendientes ?? 0}
            inProgress={summary?.en_proceso ?? 0}
            attended={summary?.atendidas ?? 0}
            cancelled={summary?.canceladas ?? 0}
            loading={summaryQuery.isPending}
          />
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardTerritorialActivity
          data={entitiesQuery.data}
          loading={entitiesQuery.isPending}
        />
        <DashboardOperationalIndicators
          summary={summary}
          entities={entitiesQuery.data}
          loading={summaryQuery.isPending || entitiesQuery.isPending}
        />
      </section>

      <DashboardRecentTable
        attentions={recentQuery.data?.items ?? []}
        loading={recentQuery.isPending}
      />
    </div>
  );
}
