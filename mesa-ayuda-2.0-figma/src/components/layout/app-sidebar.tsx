import type { FocusEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";
import { ChevronDown, Dot } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import {
  canAccessNavigationItem,
  getVisibleNavigationChildren,
  sidebarNavigation,
  type NavigationItem,
} from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";

type AppSidebarProps = {
  expanded?: boolean;
  permissions?: readonly string[];
  onHoverChange?: (hovered: boolean) => void;
  onFocusWithinChange?: (focused: boolean) => void;
  onNavigate?: () => void;
};

type GroupOverrideState = {
  pathname: string;
  values: ReadonlyMap<string, boolean>;
};

const EMPTY_PERMISSIONS: readonly string[] = [];
const EMPTY_GROUP_OVERRIDES: ReadonlyMap<string, boolean> = new Map();

function isGroupRouteActive(item: NavigationItem, pathname: string): boolean {
  const children = item.children ?? [];

  return children.some((child) =>
    child.to === "/app/usuarios"
      ? pathname === child.to ||
        /^\/app\/usuarios\/[^/]+\/editar$/.test(pathname)
      : pathname === child.to || pathname.startsWith(`${child.to}/`),
  );
}

export function AppSidebar({
  expanded = false,
  permissions = EMPTY_PERMISSIONS,
  onHoverChange,
  onFocusWithinChange,
  onNavigate,
}: AppSidebarProps) {
  const location = useLocation();

  const visibleItems = useMemo(
    () =>
      sidebarNavigation.filter((item) =>
        canAccessNavigationItem(item, permissions),
      ),
    [permissions],
  );

  const activeGroups = useMemo(() => {
    const groups = new Set<string>();

    for (const item of visibleItems) {
      if (
        item.children?.length &&
        isGroupRouteActive(item, location.pathname)
      ) {
        groups.add(item.label);
      }
    }

    return groups;
  }, [location.pathname, visibleItems]);

  const [groupOverrides, setGroupOverrides] = useState<GroupOverrideState>(
    () => ({
      pathname: location.pathname,
      values: EMPTY_GROUP_OVERRIDES,
    }),
  );

  const currentOverrides =
    groupOverrides.pathname === location.pathname
      ? groupOverrides.values
      : EMPTY_GROUP_OVERRIDES;

  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    ) {
      onFocusWithinChange?.(false);
    }
  };

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    const isPrimaryNavigation =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;

    if (isPrimaryNavigation) onNavigate?.();
  };

  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-[var(--header-height)] z-30",
        "w-[var(--sidebar-current-width)] overflow-x-hidden overflow-y-auto",
        "border-r border-white/5 bg-[var(--ui-sidebar)] px-2 py-3",
        "transition-[width,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        expanded && "md:shadow-[8px_0_20px_rgba(15,23,42,0.1)]",
      )}
      aria-label="Navegación lateral"
      data-expanded={expanded ? "true" : "false"}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocusCapture={() => onFocusWithinChange?.(true)}
      onBlurCapture={handleBlurCapture}
    >
      <nav className="space-y-1" aria-label="Módulos principales">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const children = getVisibleNavigationChildren(item, permissions);

          if (children.length) {
            const defaultOpen = activeGroups.has(item.label);
            const isOpen =
              currentOverrides.get(item.label) ?? defaultOpen;
            const isActive = isGroupRouteActive(
              item,
              location.pathname,
            );

            return (
              <div key={item.label}>
                <button
                  type="button"
                  title={expanded ? undefined : item.label}
                  aria-expanded={isOpen}
                  onClick={() =>
                    setGroupOverrides((current) => {
                      const baseValues =
                        current.pathname === location.pathname
                          ? current.values
                          : EMPTY_GROUP_OVERRIDES;
                      const nextValues = new Map(baseValues);

                      nextValues.set(item.label, !isOpen);

                      return {
                        pathname: location.pathname,
                        values: nextValues,
                      };
                    })
                  }
                  className={cn(
                    "focus-ring flex min-h-10 w-full items-center justify-center overflow-hidden rounded-md px-2 text-[13px] font-medium",
                    "text-[var(--ui-sidebar-text)] transition-[background-color,color,gap,padding] duration-150",
                    "hover:bg-white/5 hover:text-slate-200",
                    expanded && "md:justify-start md:gap-2.5 md:px-3",
                    isActive &&
                      "bg-[var(--ui-primary-soft)] font-bold text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)] hover:text-[var(--ui-primary)]",
                  )}
                >
                  <Icon
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={1.85}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "max-w-0 translate-x-1 overflow-hidden whitespace-nowrap opacity-0",
                      "transition-[max-width,opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                      expanded &&
                        "md:max-w-[132px] md:translate-x-0 md:opacity-100",
                    )}
                  >
                    {item.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "ml-auto hidden h-3.5 w-3.5 shrink-0 text-current transition-transform duration-150 md:block",
                      !expanded && "md:hidden",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {expanded && isOpen ? (
                  <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-2">
                    {children.map((child) => {
                      const ChildIcon = child.icon ?? Dot;

                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          end={child.to === "/app/usuarios"}
                          onClick={handleNavigation}
                          className={({ isActive: childActive }) =>
                            cn(
                              "focus-ring flex min-h-8 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium",
                              "text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200",
                              childActive &&
                                "bg-white/7 font-semibold text-white",
                            )
                          }
                        >
                          <ChildIcon
                            className="h-4 w-4 shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {child.label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

          if (!item.to) return null;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              title={expanded ? undefined : item.label}
              onClick={handleNavigation}
              className={({ isActive }) =>
                cn(
                  "focus-ring flex min-h-10 w-full items-center justify-center gap-0 overflow-hidden rounded-md px-2 text-[13px] font-medium",
                  "text-[var(--ui-sidebar-text)] transition-[background-color,color,gap,padding] duration-150",
                  "hover:bg-white/5 hover:text-slate-200",
                  expanded && "md:justify-start md:gap-2.5 md:px-3",
                  isActive &&
                    "bg-[var(--ui-primary-soft)] font-bold text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)] hover:text-[var(--ui-primary)]",
                )
              }
            >
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={1.85}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "max-w-0 translate-x-1 overflow-hidden whitespace-nowrap opacity-0",
                  "transition-[max-width,opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                  expanded &&
                    "md:max-w-[164px] md:translate-x-0 md:opacity-100",
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
