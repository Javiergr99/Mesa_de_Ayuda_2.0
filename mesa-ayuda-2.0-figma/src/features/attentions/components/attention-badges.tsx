import { CircleAlert, CircleCheck, Clock3, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AttentionPriority, AttentionStatus } from "@/features/attentions/model/attention.types";

const statusConfig: Record<AttentionStatus, { tone: "amber" | "violet" | "slate" | "emerald" | "red"; icon: typeof Clock3 }> = {
  Pendiente: { tone: "amber", icon: Clock3 },
  "En proceso": { tone: "violet", icon: Clock3 },
  "En espera": { tone: "slate", icon: Pause },
  Finalizada: { tone: "emerald", icon: CircleCheck },
  Cancelada: { tone: "red", icon: CircleAlert },
};

const priorityTone: Record<AttentionPriority, "slate" | "blue" | "amber" | "red"> = {
  Baja: "slate",
  Media: "blue",
  Alta: "amber",
  Urgente: "red",
};

export function StatusBadge({ status }: { status: AttentionStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return <Badge tone={config.tone}><Icon className="h-3.5 w-3.5" />{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: AttentionPriority }) {
  return <Badge tone={priorityTone[priority]}>{priority}</Badge>;
}
