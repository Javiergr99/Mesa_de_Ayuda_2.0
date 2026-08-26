import type {
  BitacoraApiRecord,
  BitacoraArchivoApi,
} from "@/features/attentions/api/attentions.contracts";
import {
  ATTENTION_CASE_CATALOG,
  ATTENTION_REGISTRY_CATALOG,
  ATTENTION_STATUS_CATALOG,
  findCatalogLabel,
} from "@/features/attentions/model/attention.catalogs";
import type {
  Attention,
  AttentionFile,
  AttentionStatus,
} from "@/features/attentions/model/attention.types";
import { getFederalEntityName } from "@/shared/catalogs/federal-entities";

const ATTENTION_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

function fullName(record: BitacoraApiRecord): string {
  return [record.nombre, record.primer_apellido, record.segundo_apellido]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ") || "Sin nombre";
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return ATTENTION_DATE_TIME_FORMATTER.format(date);
}

function statusFrom(record: BitacoraApiRecord): AttentionStatus {
  const raw = (
    record.estatus?.nombre ??
    record.estatus?.clave ??
    findCatalogLabel(ATTENTION_STATUS_CATALOG, record.estatus_id) ??
    ""
  )
    .trim()
    .toUpperCase()
    .replaceAll("_", " ");

  if (raw === "PENDIENTE") return "Pendiente";
  if (raw === "EN PROCESO") return "En proceso";
  if (raw === "ATENDIDA") return "Atendida";
  if (raw === "CANCELADA") return "Cancelada";
  return "Sin estatus";
}

function labelFromCatalog(
  relation: { nombre?: string | null; clave?: string | null } | null | undefined,
  fallback: string | null,
  id: number | null | undefined,
  prefix: string,
): string {
  return relation?.nombre?.trim() || relation?.clave?.trim() || fallback || (id ? `${prefix} #${id}` : "—");
}

function shortReference(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

function formatBytes(value?: number | null): string {
  if (!value || value <= 0) return "Tamaño no informado";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function mapBitacoraToAttention(record: BitacoraApiRecord): Attention {
  return {
    id: record.id,
    reference: shortReference(record.id),
    createdAt: formatDateTime(record.created_at),
    updatedAt: formatDateTime(record.updated_at),
    date: record.fecha ?? "—",
    time: record.hora ?? "—",
    requester: fullName(record),
    email: record.correo ?? "—",
    phone: record.telefono ?? "—",
    instance: record.instancia ?? "—",
    description: record.observaciones ?? "Sin observaciones registradas.",
    attendedBy: record.atendido_por ?? "Usuario autenticado",
    createdBy: record.creado_por ?? "—",
    entityId: record.entidad_federativa_id ?? null,
    entity: labelFromCatalog(
      record.entidad_federativa,
      record.entidad_federativa_id
        ? getFederalEntityName(record.entidad_federativa_id)
        : null,
      record.entidad_federativa_id,
      "Entidad",
    ),
    statusId: record.estatus_id ?? null,
    status: statusFrom(record),
    caseTypeId: record.tipo_caso_id ?? null,
    caseType: labelFromCatalog(
      record.tipo_caso,
      findCatalogLabel(ATTENTION_CASE_CATALOG, record.tipo_caso_id),
      record.tipo_caso_id,
      "Tipo de caso",
    ),
    registryTypeId: record.tipo_registro_id ?? null,
    registry: labelFromCatalog(
      record.tipo_registro,
      findCatalogLabel(ATTENTION_REGISTRY_CATALOG, record.tipo_registro_id),
      record.tipo_registro_id,
      "Registro",
    ),
    files: [],
    raw: record,
  };
}

export function mapArchivoToAttentionFile(file: BitacoraArchivoApi): AttentionFile {
  const fileId = file.archivo_id ?? file.id;

  if (!fileId) {
    throw new Error(
      "La API devolvio un archivo sin archivo_id.",
    );
  }

  return {
    id: fileId,
    name:
      file.nombre_original ??
      file.nombre ??
      `Archivo ${fileId.slice(0, 8)}`,
    size: formatBytes(
      file.tamanio_bytes ??
        file.tamano_bytes ??
        file.size,
    ),
    date: formatDateTime(
      file.created_at ?? file.fecha_creacion,
    ),
    isEmail: Boolean(file.es_correo_msg),
  };
}
