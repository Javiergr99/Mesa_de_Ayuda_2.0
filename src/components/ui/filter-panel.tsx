import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/cn";

export type ActiveFilterChip = {
  key: string;
  label: string;
  onRemove?: () => void;
};

export function FilterPanel({
  children,
  activeFilters = [],
  onClear,
  onApply,
  applyLabel = "Aplicar filtros",
  clearLabel = "Limpiar filtros",
  className,
}: {
  children: ReactNode;
  activeFilters?: readonly ActiveFilterChip[];
  onClear: () => void;
  onApply: () => void;
  applyLabel?: string;
  clearLabel?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      {children}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filtros activos:</span>

          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex min-h-7 items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50/70 px-2.5 text-xs font-semibold text-blue-700"
            >
              {filter.label}

              {filter.onRemove ? (
                <button
                  type="button"
                  onClick={filter.onRemove}
                  className="focus-ring grid h-4 w-4 place-items-center rounded-full hover:bg-blue-100"
                  aria-label={`Quitar filtro ${filter.label}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              ) : null}
            </span>
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onClear}>
            {clearLabel}
          </Button>
          <Button onClick={onApply}>{applyLabel}</Button>
        </div>
      </div>
    </Card>
  );
}
