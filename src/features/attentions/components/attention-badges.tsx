import { CircleAlert, CircleCheck, Clock3, CircleHelp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AttentionStatus } from "@/features/attentions/model/attention.types";

const statusConfig: Record<
  AttentionStatus,
  {
    tone: "amber" | "violet" | "slate" | "emerald" | "red";
    icon: typeof Clock3;
  }
> = {
  Pendiente: { tone: "amber", icon: Clock3 },
  "En proceso": { tone: "violet", icon: Clock3 },
  Atendida: { tone: "emerald", icon: CircleCheck },
  Cancelada: { tone: "red", icon: CircleAlert },
  "Sin estatus": { tone: "slate", icon: CircleHelp },
};

export function StatusBadge({ status }: { status: AttentionStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge tone={config.tone}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}
