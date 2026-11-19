import type { DashboardTemporalPoint } from "@/features/dashboard/api/dashboard.contracts";
import type { DashboardStatusItem } from "@/features/dashboard/api/dashboard.contracts";
import { cn } from "@/shared/lib/cn";

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "#F59E0B",
  EN_PROCESO: "#8B5CF6",
  ATENDIDA: "#10B981",
  CANCELADA: "#EF4444",
  SIN_ESTATUS: "#94A3B8",
};

const ADDITIONAL_STATUS_COLORS = [
  "#0284C7", "#D946EF", "#0D9488", "#EA580C", "#4F46E5", "#65A30D", "#DB2777",
];

function statusColor(code: string): string {
  const known = STATUS_COLORS[code.toUpperCase()];
  if (known) return known;
  // Stable color for each code, even when the catalog changes its ordering.
  const hash = [...code].reduce((value, char) => value * 31 + char.charCodeAt(0), 0) >>> 0;
  return ADDITIONAL_STATUS_COLORS[hash % ADDITIONAL_STATUS_COLORS.length]!;
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  month: "short",
});

const CHART_TICKS = [0, 0.25, 0.5, 0.75, 1] as const;

function ChartSkeleton({ height = "h-[248px]" }: { height?: string }) {
  return (
    <div className={cn("mt-5 overflow-hidden rounded-xl bg-slate-50", height)}>
      <div className="h-full animate-pulse bg-gradient-to-r from-slate-100 via-white to-slate-100" />
    </div>
  );
}

function compactPeriodLabel(period: string): string {
  const value = period.trim();
  if (!value) return "—";

  const dateMatch = /^(\d{4})-(\d{2})/.exec(value);
  if (!dateMatch) return value.length > 10 ? `${value.slice(0, 9)}…` : value;

  const [, year, month] = dateMatch;
  const date = new Date(Number(year), Number(month) - 1, 1);

  return MONTH_LABEL_FORMATTER.format(date).replace(".", "");
}

export function DashboardActivityChart({
  points,
  loading,
}: {
  points: DashboardTemporalPoint[];
  loading: boolean;
}) {
  if (loading) return <ChartSkeleton />;

  if (!points.length) {
    return (
      <div className="mt-5 grid h-[248px] place-items-center rounded-xl bg-slate-50 px-6 text-center text-sm text-slate-500">
        Sin datos para representar la actividad del periodo seleccionado.
      </div>
    );
  }

  const width = 760;
  const height = 250;
  const left = 48;
  const right = 18;
  const top = 14;
  const bottom = 42;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const maximum = Math.max(...points.map((point) => point.total), 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(maximum)));
  const ceiling = maximum <= 10 ? 10 : Math.ceil(maximum / magnitude) * magnitude;
  const safeCeiling = Math.max(ceiling, maximum, 1);
  const groupWidth = chartWidth / points.length;
  const barWidth = Math.min(28, Math.max(10, groupWidth * 0.32));

  return (
    <div className="mt-4 min-h-[254px] overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[560px]"
        role="img"
        aria-label="Actividad de atenciones por periodo"
      >
        {CHART_TICKS.map((ratio) => {
          const y = top + chartHeight - chartHeight * ratio;
          const tickValue = Math.round(safeCeiling * ratio);

          return (
            <g key={ratio}>
              <line x1={left} y1={y} x2={width - right} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x={left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
                {tickValue.toLocaleString("es-MX")}
              </text>
            </g>
          );
        })}

        {points.map((point, index) => {
          const x = left + groupWidth * index + groupWidth / 2 - barWidth / 2;
          const barHeight = Math.max(2, (point.total / safeCeiling) * chartHeight);
          const y = top + chartHeight - barHeight;

          return (
            <g key={`${point.periodo}-${index}`}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="#2563EB" />
              <text
                x={x + barWidth / 2}
                y={height - 17}
                textAnchor="middle"
                fontSize="10"
                fill="#64748B"
              >
                {compactPeriodLabel(point.periodo)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

type StatusDistributionProps = {
  statuses: readonly DashboardStatusItem[];
  loading: boolean;
  unavailable?: boolean;
};

export function DashboardStatusDistribution({
  statuses,
  loading,
  unavailable = false,
}: StatusDistributionProps) {
  if (loading) return <ChartSkeleton height="h-[254px]" />;
  if (unavailable) {
    return (
      <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600" role="status">
        La distribución por estatus no está disponible en la respuesta del servidor.
      </p>
    );
  }

  const total = statuses.reduce((sum, status) => sum + status.total, 0);
  const populated = statuses.filter((status) => status.total > 0);
  let currentPercent = 0;
  const segments = populated.map((status) => {
    const start = currentPercent;
    currentPercent += (status.total / total) * 100;
    return `${statusColor(status.clave)} ${start}% ${currentPercent}%`;
  });
  const gradient = total ? `conic-gradient(${segments.join(", ")})` : "#E2E8F0";

  return (
    <div className="mt-5 flex flex-col items-center">
      <div
        className="relative grid h-[142px] w-[142px] place-items-center rounded-full"
        style={{ background: gradient }}
        role="img"
        aria-label={`Distribución de ${total.toLocaleString("es-MX")} atenciones por estatus`}
      >
        <div className="grid h-[100px] w-[100px] place-items-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgb(226_232_240/0.7)]">
          <div>
            <p className="text-[20px] font-bold leading-none text-slate-900">
              {total.toLocaleString("es-MX")}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">Registros</p>
          </div>
        </div>
      </div>

      {statuses.length ? (
        <div className="app-scrollbar mt-5 max-h-[230px] w-full space-y-2 overflow-y-auto pr-1">
          {statuses.map((status) => {
            const percentage = total ? Math.round((status.total / total) * 100) : 0;
            return (
              <div key={status.id} className="flex items-center justify-between gap-3 text-[11px]">
                <span className="flex min-w-0 items-center gap-2 text-slate-700">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: statusColor(status.clave) }}
                    aria-hidden="true"
                  />
                  <span className="truncate" title={status.nombre}>
                    {status.nombre}
                  </span>
                </span>
                <span className="shrink-0 font-bold text-slate-900">
                  {status.total.toLocaleString("es-MX")} · {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 text-xs text-slate-500">Sin estatus disponibles.</p>
      )}
    </div>
  );
}
