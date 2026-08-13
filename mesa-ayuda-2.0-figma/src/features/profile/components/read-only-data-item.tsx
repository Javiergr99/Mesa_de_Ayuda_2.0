import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type ReadOnlyDataItemProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function ReadOnlyDataItem({ label, value, className }: ReadOnlyDataItemProps) {
  return (
    <div className={cn("min-w-0 px-4 py-3.5 sm:px-5", className)}>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--ui-text-secondary)]">
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-[13px] font-semibold leading-5 text-[var(--ui-text-primary)] sm:text-sm">
        {value}
      </dd>
    </div>
  );
}
