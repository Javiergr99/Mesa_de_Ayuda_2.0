import {
  CalendarDays,
  ChartNoAxesCombined,
  CirclePlus,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";

export type NavigationChildItem = {
  label: string;
  icon?: LucideIcon;
  to: string;
  requiredAnyAction?: readonly string[];
  exactActions?: boolean;
};

export type NavigationItem = {
  label: string;
  to?: string;
  icon: LucideIcon;
  requiredAnyAction?: readonly string[];
  exactActions?: boolean;
  children?: NavigationChildItem[];
};

export const sidebarNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    to: "/app/dashboard",
    icon: LayoutDashboard,
    requiredAnyAction: [
      MESA_AYUDA_ACTIONS.viewDashboard,
    ],
    exactActions: true,
  },
  {
    label: "Organizador",
    to: "/app/organizador",
    icon: CalendarDays,
  },
  {
    label: "Atenciones",
    to: "/app/atenciones",
    icon: ClipboardList,
    requiredAnyAction: [
      MESA_AYUDA_ACTIONS.viewLog,
    ],
    exactActions: true,
  },
  {
    label: "Registrar Atención",
    to: "/app/atenciones/nueva",
    icon: CirclePlus,
    requiredAnyAction: [
      MESA_AYUDA_ACTIONS.createLog,
    ],
    exactActions: true,
  },
  {
    label: "Seguimiento",
    to: "/app/seguimiento",
    icon: ListChecks,
    requiredAnyAction: [
      MESA_AYUDA_ACTIONS.viewLog,
    ],
    exactActions: true,
  },
  {
    label: "Minería",
    to: "/app/mineria",
    icon: ChartNoAxesCombined,
  },
];

type NavigationAccessItem = Pick<
  NavigationItem | NavigationChildItem,
  "requiredAnyAction" | "exactActions"
>;

function canAccessWithPermissionSet(
  item: NavigationAccessItem,
  permissionSet: ReadonlySet<string>,
): boolean {
  if (!item.requiredAnyAction?.length) {
    return true;
  }

  if (
    !item.exactActions &&
    permissionSet.has("SUPER_ADMIN")
  ) {
    return true;
  }

  for (const action of item.requiredAnyAction) {
    if (permissionSet.has(action)) {
      return true;
    }
  }

  return false;
}

export function canAccessNavigationItem(
  item: NavigationAccessItem,
  permissions: readonly string[],
): boolean {
  return canAccessWithPermissionSet(
    item,
    new Set(permissions),
  );
}

export function getVisibleNavigationChildren(
  item: NavigationItem,
  permissions: readonly string[],
): NavigationChildItem[] {
  const children = item.children ?? [];

  if (!children.length) return [];

  const permissionSet = new Set(permissions);
  const visible: NavigationChildItem[] = [];

  for (const child of children) {
    if (
      canAccessWithPermissionSet(
        child,
        permissionSet,
      )
    ) {
      visible.push(child);
    }
  }

  return visible;
}

const formatoNnaPublicUrl =
  import.meta.env.VITE_FORMATO_NNA_PUBLIC_URL?.trim() ||
  "http://127.0.0.1:5176";

export const topNavigation = [
  {
    label: "Dashboard",
    to: "/app/dashboard",
  },
  {
    label: "Por Tus Derechos",
    to: "#por-tus-derechos",
  },
  {
    label: "Micrositio",
    to: "#micrositio",
  },
  {
    label: "Agenda",
    to: "/app/organizador",
  },
  {
    label: "Formato de Atenciones NNA",
    to: formatoNnaPublicUrl,
    external: true,
  },
] as const;
