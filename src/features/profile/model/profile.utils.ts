import type { AuthenticatedUser } from "@/features/auth/api/auth.contracts";
export { getFederalEntityName } from "@/shared/catalogs/federal-entities";
import {
  getUserActionNames,
  getUserDisplayName,
  isSuperAdmin,
  userHasAction,
} from "@/features/auth/model/auth.selectors";

const PROFILE_DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const ADMINISTRATIVE_ACTION_LABELS: Record<string, string> = {
  ADMINISTRAR_USUARIOS: "Administración de usuarios",
  VER_USUARIOS: "Consulta de usuarios",
  CREAR_USUARIO: "Creación de usuarios",
  ACTUALIZAR_USUARIO: "Actualización de usuarios",
  DESACTIVAR_USUARIO: "Cambio de estatus",
  ASIGNAR_GRUPOS_USUARIO: "Asignación de grupos",
  ASIGNAR_MODULOS_USUARIO: "Asignación de módulos",
  ASIGNAR_ACCIONES_USUARIO: "Asignación de acciones",
  VER_CATALOGO_PERMISOS: "Consulta del catálogo de permisos",
  CREAR_GRUPO: "Creación de grupos",
  ACTUALIZAR_GRUPO: "Actualización de grupos",
  ELIMINAR_GRUPO: "Administración lógica de grupos",
  CREAR_MODULO: "Creación de módulos",
  ACTUALIZAR_MODULO: "Actualización de módulos",
  ELIMINAR_MODULO: "Administración lógica de módulos",
  CREAR_ACCION: "Creación de acciones",
  ACTUALIZAR_ACCION: "Actualización de acciones",
  ELIMINAR_ACCION: "Administración lógica de acciones",
};

export type AccountTone = "success" | "warning" | "danger" | "neutral";

export type AccountStatusView = {
  label: string;
  tone: AccountTone;
};

export function getProfileInitials(user: AuthenticatedUser): string {
  const initials: string[] = [];

  for (const part of [
    user.nombre,
    user.primer_apellido,
    user.segundo_apellido,
  ]) {
    const initial = part
      ?.trim()
      .charAt(0)
      .toUpperCase();

    if (initial) initials.push(initial);
  }

  return initials.join("").slice(0, 3);
}

export function formatProfileDate(value?: string | null): string {
  if (!value) return "No disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No disponible";

  return PROFILE_DATE_FORMATTER.format(date);
}

export function getAccountStatusView(user: AuthenticatedUser): AccountStatusView {
  const statusName = user.estatus?.nombre?.trim() || "Sin estatus";
  const normalized = statusName.toUpperCase();

  if (normalized.includes("ACTIVO") && !normalized.includes("INACTIVO")) {
    return { label: statusName, tone: "success" };
  }

  if (normalized.includes("PROCESO") || normalized.includes("PENDIENTE")) {
    return { label: statusName, tone: "warning" };
  }

  if (
    normalized.includes("BLOQUE") ||
    normalized.includes("EXCESO") ||
    normalized.includes("SUSPEND")
  ) {
    return { label: statusName, tone: "danger" };
  }

  return { label: statusName, tone: "neutral" };
}

export function getAdministrativeRole(user: AuthenticatedUser): string | null {
  if (isSuperAdmin(user)) return "SUPER_ADMIN";
  if (userHasAction(user, "ADMINISTRAR_USUARIOS")) return "Administrador";
  return null;
}

export function getAdministrativeAccessLabels(user: AuthenticatedUser): string[] {
  const actions = new Set(getUserActionNames(user));
  const labels: string[] = [];

  for (const [action, label] of Object.entries(
    ADMINISTRATIVE_ACTION_LABELS,
  )) {
    if (actions.has(action)) {
      labels.push(label);
    }
  }

  const canRemovePermissions = [
    "QUITAR_GRUPOS_USUARIO",
    "QUITAR_MODULOS_USUARIO",
    "QUITAR_ACCIONES_USUARIO",
  ].some((action) => actions.has(action));

  if (canRemovePermissions) labels.push("Retiro de permisos");
  if (actions.has("SUPER_ADMIN")) labels.push("Administración global");

  return [...new Set(labels)];
}

export function getProfileHeading(user: AuthenticatedUser): string {
  return getUserDisplayName(user);
}
