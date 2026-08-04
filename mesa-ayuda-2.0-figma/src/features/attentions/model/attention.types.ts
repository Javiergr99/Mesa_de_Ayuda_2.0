export type AttentionStatus = "Pendiente" | "En proceso" | "En espera" | "Finalizada" | "Cancelada";
export type AttentionPriority = "Baja" | "Media" | "Alta" | "Urgente";
export type RegistryCode = "RMH" | "RMP" | "RDVF" | "RNOA";

export type Attention = {
  id: string;
  folio: string;
  createdAt: string;
  requester: string;
  email: string;
  username: string;
  phone: string;
  extension: string;
  profile: string;
  type: string;
  registry: RegistryCode;
  priority: AttentionPriority;
  status: AttentionStatus;
  state: string;
  municipality: string;
  scope: string;
  area: string;
  responsible: string;
  description: string;
  updatedAt: string;
  nextReview: string;
  files: Array<{ id: string; name: string; size: string; date: string }>;
  history: Array<{
    id: string;
    user: string;
    action: string;
    date: string;
    description?: string;
  }>;
};
