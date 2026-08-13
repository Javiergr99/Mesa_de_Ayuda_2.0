import { CheckCircle2, CircleAlert, CircleMinus, ShieldAlert } from "lucide-react";

import type { AccountTone } from "@/features/profile/model/profile.utils";
import { cn } from "@/shared/lib/cn";

type ProfileStatusBadgeProps = {
  label: string;
  tone?: AccountTone;
  compact?: boolean;
};

const toneClasses: Record<AccountTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/10",
  danger: "bg-red-50 text-red-700 ring-red-600/10",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/10",
};

const toneIcons = {
  success: CheckCircle2,
  warning: CircleAlert,
  danger: ShieldAlert,
  neutral: CircleMinus,
} satisfies Record<AccountTone, typeof CheckCircle2>;

export function ProfileStatusBadge({
  label,
  tone = "neutral",
  compact = false,
}: ProfileStatusBadgeProps) {
  const Icon = toneIcons[tone];

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset",
        toneClasses[tone],
        compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
      )}
    >
      <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}
