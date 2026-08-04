import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function SectionCard({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
        <span className="text-blue-600">{icon}</span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}
