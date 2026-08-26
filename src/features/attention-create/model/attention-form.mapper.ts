import type { BitacoraCreatePayload } from "@/features/attentions/api/attentions.contracts";
import type { AttentionFormValues } from "@/features/attention-create/model/attention-form.schema";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function catalogId(value: string): number | undefined {
  return value ? Number(value) : undefined;
}

export function mapAttentionFormToCreatePayload(
  values: AttentionFormValues,
): BitacoraCreatePayload {
  return {
    nombre: emptyToUndefined(values.name),
    primer_apellido: emptyToUndefined(values.firstName),
    segundo_apellido: emptyToUndefined(values.secondName),
    fecha: emptyToUndefined(values.date),
    hora: emptyToUndefined(values.time),
    instancia: emptyToUndefined(values.instance),
    correo: emptyToUndefined(values.email),
    telefono: emptyToUndefined(values.phone),
    observaciones: emptyToUndefined(values.observations),
    entidad_federativa_id: catalogId(values.entityId),
    estatus_id: catalogId(values.statusId),
    tipo_caso_id: catalogId(values.caseTypeId),
    tipo_registro_id: catalogId(values.registryTypeId),
  };
}
