import { z } from "zod";

const optionalEmail = z
  .string()
  .refine(
    (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Ingrese un correo electrónico válido.",
  );

const optionalCatalogId = z
  .string()
  .refine(
    (value) => !value || (Number.isInteger(Number(value)) && Number(value) > 0),
    "Seleccione una opción válida.",
  );

function getTodayDateValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const optionalAttentionDate = z
  .string()
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Ingrese una fecha válida.")
  .refine(
    (value) => !value || value <= getTodayDateValue(),
    "La fecha de atención no puede ser posterior a la fecha actual.",
  );
export const attentionFormSchema = z.object({
  name: z.string().max(100, "Máximo 100 caracteres."),
  firstName: z.string().max(100, "Máximo 100 caracteres."),
  secondName: z.string().max(100, "Máximo 100 caracteres."),
  date: optionalAttentionDate,
  time: z.string(),
  instance: z.string().max(150, "Máximo 150 caracteres."),
  email: optionalEmail.refine((value) => value.length <= 200, "Máximo 200 caracteres."),
  phone: z.string().max(20, "Máximo 20 caracteres."),
  observations: z.string(),
  entityId: optionalCatalogId,
  statusId: optionalCatalogId,
  caseTypeId: optionalCatalogId,
  registryTypeId: optionalCatalogId,
});

export type AttentionFormValues = z.infer<typeof attentionFormSchema>;

export function createAttentionFormDefaults({
  date,
  instance,
  entityId,
}: {
  date: string;
  instance?: string | null;
  entityId?: number | null;
}): AttentionFormValues {
  return {
    name: "",
    firstName: "",
    secondName: "",
    date,
    time: "",
    instance: instance ?? "",
    email: "",
    phone: "",
    observations: "",
    entityId: entityId ? String(entityId) : "",
    statusId: "",
    caseTypeId: "",
    registryTypeId: "",
  };
}
