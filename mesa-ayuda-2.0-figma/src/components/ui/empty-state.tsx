import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-bold text-[var(--ui-text-primary)]">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-[var(--ui-text-secondary)]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
