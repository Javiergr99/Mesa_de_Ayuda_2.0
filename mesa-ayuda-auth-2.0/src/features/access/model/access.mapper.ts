import { BarChart3, ClipboardList, UsersRound } from "lucide-react";

import type {
  AccessItem,
  AccessLevel,
  AccessTarget,
  AccessVisualMetadata,
  AvailableAccess,
} from "@/features/access/model/access.types";
import { formatPermissionLabel } from "@/features/access/model/permission-labels";

const visualMetadata: Record<AccessTarget, AccessVisualMetadata> = {
  MESA_AYUDA: {
    title: "Mesa de Ayuda",
    tone: "blue",
    icon: ClipboardList,
    modules: ["Dashboard", "Atenciones", "Registro", "Seguimiento"],
  },
  FORMATOS_ATENCIONES: {
    title: "Formato de NNA",
    tone: "emerald",
    icon: BarChart3,
    modules: ["Captura", "Consulta", "Indicadores", "Exportaciones"],
  },
  ADMINISTRACION_SISTEMA: {
    title: "Administración del sistema",
    tone: "amber",
    icon: UsersRound,
    modules: ["Usuarios", "Grupos", "Permisos", "Configuración"],
  },
};

const levelLabels: Record<AccessLevel, string> = {
  full: "Acceso completo",
  limited: "Acceso limitado",
  read_only: "Solo lectura",
  restricted: "Acceso restringido",
};

export function mapAvailableAccess(access: AvailableAccess): AccessItem {
  const metadata = visualMetadata[access.target_app];

  return {
    ...access,
    title: access.name || metadata.title,
    tone: metadata.tone,
    icon: metadata.icon,
    modules: metadata.modules,
    visiblePermissions: access.permissions.slice(0, 3).map((code) => ({
      code,
      label: formatPermissionLabel(code),
    })),
    badgeLabel: levelLabels[access.access_level],
    buttonLabel:
      access.access_level === "restricted" ? "No disponible" : "Ingresar",
  };
}
