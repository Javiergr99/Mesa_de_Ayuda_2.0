import type { MouseEvent } from "react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router";

import { canAccessNavigationItem, sidebarNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";

type AppSidebarProps = {
  expanded?: boolean;
  permissions?: readonly string[];
  onHoverChange?: (hovered: boolean) => void;
  onFocusWithinChange?: (focused: boolean) => void;
  onNavigate?: () => void;
};

const EMPTY_PERMISSIONS: readonly string[] = [];

function isSidebarItemActive(itemPath: string, pathname: string): boolean {
  if (itemPath === "/app/atenciones/nueva") {
    return pathname === itemPath;
  }

  if (itemPath === "/app/atenciones") {
    return (
      pathname === itemPath ||
      (pathname.startsWith("/app/atenciones/") && pathname !== "/app/atenciones/nueva")
    );
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function isPrimaryNavigation(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function AppSidebar({ permissions = EMPTY_PERMISSIONS, onNavigate }: AppSidebarProps) {
  const location = useLocation();

  const visibleItems = useMemo(
    () => sidebarNavigation.filter((item) => canAccessNavigationItem(item, permissions)),
    [permissions],
  );

  return (
    <aside
      className="fixed bottom-0 left-0 top-[var(--header-height)] z-30 w-[var(--sidebar-current-width)] overflow-x-hidden overflow-y-auto border-r border-white/5 bg-[var(--ui-sidebar)] px-2 py-3"
      aria-label="Navegación lateral"
    >
      <nav className="space-y-1" aria-label="Módulos principales">
        {visibleItems.map((item) => {
          if (!item.to) return null;

          const Icon = item.icon;
          const active = isSidebarItemActive(item.to, location.pathname);

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              onClick={(event) => {
                if (isPrimaryNavigation(event)) {
                  onNavigate?.();
                }
              }}
              className={cn(
                "focus-ring flex min-h-10 w-full items-center justify-center overflow-hidden rounded-md px-2 text-[13px] font-medium text-[var(--ui-sidebar-text)] transition-colors hover:bg-white/5 hover:text-slate-200",
                "md:justify-start md:gap-2.5 md:px-3",
                active &&
                  "bg-[var(--ui-primary-soft)] font-bold text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)] hover:text-[var(--ui-primary)]",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.85} aria-hidden="true" />
              <span className="hidden min-w-0 truncate whitespace-nowrap md:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
