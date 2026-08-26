import { Activity, Gauge, MapPinned } from "lucide-react";

import { Card } from "@/components/ui/card";
import type {
  DashboardByEntityResponse,
  DashboardSummaryResponse,
} from "@/features/dashboard/api/dashboard.contracts";
import {
  formatDashboardDecimal,
  formatDashboardNumber,
  formatDashboardPercent,
  getTopDashboardEntities,
  rankLabel,
  rankTotal,
} from "@/features/dashboard/lib/dashboard-display.utils";

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-[14px] font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-[11px] text-slate-500">{description}</p>
    </div>
  );
}

export function DashboardTerritorialActivity({
  data,
  loading,
}: {
  data?: DashboardByEntityResponse;
  loading: boolean;
}) {
  const entities = getTopDashboardEntities(data);

  return (
    <Card className="p-5">
      <PanelHeader
        title="Actividad por entidad"
        description="Entidades con mayor volumen dentro del periodo seleccionado."
      />

      {loading ? (
        <div className="mt-5 space-y-4">
          {["a", "b", "c", "d"].map((key) => (
            <div key={key} className="h-10 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : entities.length ? (
        <div className="mt-5 space-y-4">
          {entities.map((entity) => (
            <div key={entity.id}>
              <div className="mb-1.5 flex items-center justify-between gap-4 text-[11px]">
                <span className="min-w-0 truncate font-medium text-slate-700">{entity.label}</span>
                <span className="shrink-0 font-bold text-slate-900">
                  {formatDashboardNumber(entity.total)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${entity.barPercentage}%` }}
                  aria-label={`${entity.label}: ${formatDashboardDecimal(entity.percentage)}%`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid min-h-[174px] place-items-center rounded-xl bg-slate-50 px-5 text-center text-sm text-slate-500">
          No hay distribución por entidad disponible para este periodo.
        </div>
      )}
    </Card>
  );
}

function IndicatorTextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="min-w-0 text-[11px] text-slate-600">{label}</span>
      <span className="max-w-[55%] truncate text-right text-[11px] font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function IndicatorProgress({ value }: { value: number | null | undefined }) {
  const safe = Math.min(100, Math.max(0, Number(value ?? 0)));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px]">
        <span className="font-medium text-slate-700">Porcentaje de finalización</span>
        <span className="font-bold text-slate-900">{formatDashboardPercent(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Gauge;
  value: string;
  label: string;
  tone: "blue" | "violet";
}) {
  const toneClasses = tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700";

  return (
    <div className="flex min-h-[64px] items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${toneClasses}`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[16px] font-bold leading-none text-slate-900">{value}</p>
        <p className="mt-1 truncate text-[10px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function DashboardOperationalIndicators({
  summary,
  entities,
  loading,
}: {
  summary?: DashboardSummaryResponse;
  entities?: DashboardByEntityResponse;
  loading: boolean;
}) {
  const institutionalActivity =
    rankTotal(summary?.actividad_institucional_pfpnna) ??
    rankTotal(entities?.actividad_institucional_pfpnna);

  return (
    <Card className="p-5">
      <PanelHeader
        title="Indicadores operativos"
        description="Indicadores disponibles en la API para el periodo seleccionado."
      />

      {loading ? (
        <div className="mt-5 h-[194px] animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <>
          <div className="mt-5 space-y-4">
            <IndicatorProgress value={summary?.porcentaje_finalizacion} />

            <div className="space-y-3">
              <IndicatorTextRow
                label="Registro más activo"
                value={rankLabel(summary?.registro_mas_activo)}
              />
              <IndicatorTextRow
                label="Tipo de caso más frecuente"
                value={rankLabel(summary?.tipo_caso_mas_frecuente)}
              />
              <IndicatorTextRow
                label="Estado más activo"
                value={rankLabel(summary?.estado_mas_activo ?? entities?.estado_mas_activo)}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniMetric
              icon={Gauge}
              value={formatDashboardDecimal(summary?.promedio_atenciones_por_dia)}
              label="Promedio diario"
              tone="blue"
            />
            <MiniMetric
              icon={MapPinned}
              value={formatDashboardNumber(entities?.sin_entidad)}
              label="Sin entidad"
              tone="violet"
            />
          </div>

          {institutionalActivity !== null ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-[10px] text-slate-600">
              <Activity className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              <span className="min-w-0 flex-1">Actividad institucional PFPNNA</span>
              <strong className="text-slate-900">
                {formatDashboardNumber(institutionalActivity)}
              </strong>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}
