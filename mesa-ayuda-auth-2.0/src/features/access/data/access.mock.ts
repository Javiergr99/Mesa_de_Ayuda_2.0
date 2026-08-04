import { BarChart3, CalendarDays, ClipboardList, UsersRound } from "lucide-react";

import type { AccessItem } from "@/features/access/model/access.types";
import { env } from "@/shared/config/env";

export const accessItems: AccessItem[] = [
  {
    id: "mesa-ayuda",
    title: "Mesa de Ayuda",
    description:
      "Registre, consulte y dé seguimiento a las solicitudes de atención recibidas en la plataforma.",
    modules: ["Dashboard", "Atenciones", "Registro", "Seguimiento"],
    permissions: ["Consultar", "Registrar", "Actualizar", "Historial"],
    level: "full",
    tone: "blue",
    badgeLabel: "Acceso completo",
    icon: ClipboardList,
    destination: env.destinations.mesaAyuda,
  },
  {
    id: "directorio-ppnna",
    title: "Directorio PPNNA",
    description:
      "Administre eventos, reuniones, actividades y recordatorios relacionados con la operación.",
    modules: ["Mensual", "Semanal", "Lista", "Eventos", "Recordatorios"],
    permissions: ["Consultar", "Crear", "Actualizar", "Recordatorios"],
    level: "full",
    tone: "violet",
    badgeLabel: "Acceso completo",
    icon: CalendarDays,
    destination: env.destinations.directorioPpnna,
  },
  {
    id: "formato-nna",
    title: "Formato de NNA",
    description:
      "Consulte indicadores, tendencias y reportes derivados de la información registrada.",
    modules: ["Indicadores", "Estadísticas", "Reportes", "Exportaciones"],
    permissions: ["Consultar", "Generar", "Exportar", "Filtros"],
    level: "limited",
    tone: "emerald",
    badgeLabel: "Consulta y exportación",
    buttonLabel: "Ingresar",
    icon: BarChart3,
    destination: env.destinations.formatoNna,
  },
  {
    id: "administracion",
    title: "Administración del sistema",
    description:
      "Gestione usuarios, roles, permisos y configuraciones generales de Mesa de Ayuda 2.0.",
    modules: ["Usuarios", "Roles", "Permisos", "Configuración"],
    permissions: ["Consultar", "Crear", "Asignar", "Configurar"],
    level: "full",
    tone: "amber",
    badgeLabel: "Solo administradores",
    icon: UsersRound,
    destination: env.destinations.administracion,
  },
];
