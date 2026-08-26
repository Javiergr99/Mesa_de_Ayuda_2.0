import type { BitacoraApiRecord } from "@/features/attentions/api/attentions.contracts";

export type AttentionStatus =
  | "Pendiente"
  | "En proceso"
  | "Atendida"
  | "Cancelada"
  | "Sin estatus";

export type AttentionFile = {
  id: string;
  name: string;
  size: string;
  date: string;
  isEmail: boolean;
};

export type Attention = {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  time: string;
  requester: string;
  email: string;
  phone: string;
  instance: string;
  description: string;
  attendedBy: string;
  createdBy: string;
  entityId: number | null;
  entity: string;
  statusId: number | null;
  status: AttentionStatus;
  caseTypeId: number | null;
  caseType: string;
  registryTypeId: number | null;
  registry: string;
  files: AttentionFile[];
  raw: BitacoraApiRecord;
};
