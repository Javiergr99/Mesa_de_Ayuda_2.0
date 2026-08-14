import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

export type ViewModeOption<TValue extends string> = {
  value: TValue;
  label: string;
  icon?: LucideIcon;
};

export function ViewModeToggle<TValue extends string>({
  value,
  options,
  onValueChange,
  ariaLabel = "Cambiar vista",
}: {
  value: TValue;
  options: readonly ViewModeOption<TValue>[];
  onValueChange: (value: TValue) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            aria-pressed={active}
            className={cn(
              "focus-ring flex min-h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors",
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
            )}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
