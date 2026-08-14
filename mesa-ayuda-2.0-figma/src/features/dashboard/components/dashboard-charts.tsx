import type { DashboardTemporalPoint } from "@/features/dashboard/api/dashboard.contracts";
import { cn } from "@/shared/lib/cn";

const STATUS_COLORS = {
  pending: "#F59E0B",
  inProgress: "#8B5CF6",
  attended: "#10B981",
  cancelled: "#EF4444",
} as const;

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

  return MONTH_LABEL_FORMATTER
    .format(date)
    .replace(".", "");
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
              <line
                x1={left}
                y1={y}
                x2={width - right}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94A3B8"
              >
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
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="3"
                fill="#2563EB"
              />
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
  pending: number;
  inProgress: number;
  attended: number;
  cancelled: number;
  loading: boolean;
};

export function DashboardStatusDistribution({
  pending,
  inProgress,
  attended,
  cancelled,
  loading,
}: StatusDistributionProps) {
  if (loading) return <ChartSkeleton height="h-[254px]" />;

  const total = pending + inProgress + attended + cancelled;
  const safeTotal = total || 1;
  const pendingEnd = (pending / safeTotal) * 100;
  const inProgressEnd = pendingEnd + (inProgress / safeTotal) * 100;
  const attendedEnd = inProgressEnd + (attended / safeTotal) * 100;
  const gradient = `conic-gradient(
    ${STATUS_COLORS.pending} 0 ${pendingEnd}%,
    ${STATUS_COLORS.inProgress} ${pendingEnd}% ${inProgressEnd}%,
    ${STATUS_COLORS.attended} ${inProgressEnd}% ${attendedEnd}%,
    ${STATUS_COLORS.cancelled} ${attendedEnd}% 100%
  )`;

  const entries = [
    { label: "Pendiente", value: pending, color: STATUS_COLORS.pending },
    { label: "En proceso", value: inProgress, color: STATUS_COLORS.inProgress },
    { label: "Atendida", value: attended, color: STATUS_COLORS.attended },
    { label: "Cancelada", value: cancelled, color: STATUS_COLORS.cancelled },
  ];

  return (
    <div className="mt-5 flex flex-col items-center">
      <div
        className="relative grid h-[142px] w-[142px] place-items-center rounded-full"
        style={{ background: total ? gradient : "#E2E8F0" }}
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

      <div className="mt-5 w-full space-y-2">
        {entries.map((entry) => {
          const percentage = total ? Math.round((entry.value / total) * 100) : 0;

          return (
            <div
              key={entry.label}
              className="flex items-center justify-between gap-3 text-[11px]"
            >
              <span className="flex min-w-0 items-center gap-2 text-slate-700">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{entry.label}</span>
              </span>
              <span className="font-bold text-slate-900">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
