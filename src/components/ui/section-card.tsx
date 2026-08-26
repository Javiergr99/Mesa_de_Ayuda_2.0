import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-[18px]">
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--ui-border)] pb-2.5">
        <span className="text-[var(--ui-primary)]">{icon}</span>
        <h2 className="text-sm font-bold text-[var(--ui-text-primary)] sm:text-[15px]">{title}</h2>
      </div>
      {children}
    </Card>
  );
}
