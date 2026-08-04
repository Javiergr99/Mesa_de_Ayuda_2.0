import { delay } from "@/shared/lib/delay";
import { attentionsMock } from "@/features/attentions/data/attentions.mock";
import type { Attention, AttentionStatus } from "@/features/attentions/model/attention.types";

// Repositorio temporal de desarrollo. Se sustituirá por el cliente HTTP sin modificar los hooks.
let attentionsDatabase = structuredClone(attentionsMock);

export async function getAttentions(): Promise<Attention[]> {
  await delay(250);
  return structuredClone(attentionsDatabase);
}

export async function updateAttention(input: {
  id: string;
  status: AttentionStatus;
  priority: Attention["priority"];
  responsible: string;
  description: string;
  updateDescription: string;
}): Promise<Attention> {
  await delay(700);

  const attentionIndex = attentionsDatabase.findIndex((attention) => attention.id === input.id);
  if (attentionIndex < 0) {
    throw new Error("No se encontró la atención solicitada.");
  }

  const current = attentionsDatabase[attentionIndex];
  if (!current) {
    throw new Error("No se encontró la atención solicitada.");
  }

  // Cada cambio operativo genera una entrada de trazabilidad antes de actualizar la caché.
  const updated: Attention = {
    ...current,
    status: input.status,
    priority: input.priority,
    responsible: input.responsible,
    description: input.description,
    updatedAt: "Ahora",
    history: [
      {
        id: crypto.randomUUID(),
        user: "Arq. Sofía Huerta",
        action: `Actualizó la atención: ${current.status} → ${input.status}`,
        date: "Ahora",
        description: input.updateDescription,
      },
      ...current.history,
    ],
  };

  attentionsDatabase = attentionsDatabase.map((attention) => (attention.id === input.id ? updated : attention));
  return structuredClone(updated);
}
