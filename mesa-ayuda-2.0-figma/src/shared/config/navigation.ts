import {
  CalendarDays,
  ChartNoAxesCombined,
  CirclePlus,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const sidebarNavigation: NavigationItem[] = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Organizador", to: "/app/organizador", icon: CalendarDays },
  { label: "Atenciones", to: "/app/atenciones", icon: ClipboardList },
  { label: "Registrar Atención", to: "/app/atenciones/nueva", icon: CirclePlus },
  { label: "Seguimiento", to: "/app/seguimiento", icon: ListChecks },
  { label: "Minería", to: "/app/mineria", icon: ChartNoAxesCombined },
  { label: "Usuarios", to: "/app/usuarios", icon: Users },
  { label: "Configuración", to: "/app/configuracion", icon: Settings },
];

export const topNavigation = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Por Tus Derechos", to: "#por-tus-derechos" },
  { label: "Micrositio", to: "#micrositio" },
  { label: "Agenda", to: "/app/organizador" },
] as const;
