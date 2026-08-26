import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

const toneClasses = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    accent: "text-emerald-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    accent: "text-amber-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "text-emerald-600",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    accent: "text-violet-600",
  },
} as const;

type DashboardMetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: keyof typeof toneClasses;
  helper?: string;
};

export function DashboardMetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
  helper,
}: DashboardMetricCardProps) {
  const classes = toneClasses[tone];

  return (
    <article className="flex min-h-[154px] flex-col rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-5 py-4 shadow-[var(--ui-card-shadow)]">
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", classes.icon)}
          aria-hidden="true"
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>

        {helper ? (
          <span className={cn("pt-1 text-[11px] font-bold", classes.accent)}>{helper}</span>
        ) : null}
      </div>

      <p className="mt-3 text-[26px] font-bold leading-none tracking-tight text-[var(--ui-text-primary)]">
        {value}
      </p>
      <p className="mt-1.5 text-[12px] font-semibold text-[var(--ui-text-secondary)]">{title}</p>

      <div className="mt-auto border-t border-slate-200/80 pt-3">
        <p className="text-[11px] leading-4 text-[var(--ui-text-secondary)]">{detail}</p>
      </div>
    </article>
  );
}
