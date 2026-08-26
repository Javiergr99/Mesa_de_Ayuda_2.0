import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { getSessionActionNames } from "@/features/auth/services/jwt-actions";

const DESKTOP_SIDEBAR_MEDIA_QUERY = "(min-width: 768px)";

function useDesktopSidebar() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return true;
    }
    return window.matchMedia(DESKTOP_SIDEBAR_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mediaQuery = window.matchMedia(DESKTOP_SIDEBAR_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}

export function AppShell() {
  const location = useLocation();
  const isDesktop = useDesktopSidebar();
  const user = useAuthStore((state) => state.user);
  const permissions = useMemo(() => getSessionActionNames(user), [user]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarFocused, setIsSidebarFocused] = useState(false);
  const isSidebarExpanded = isDesktop && (isSidebarHovered || isSidebarFocused);

  const collapseSidebar = useCallback(() => {
    setIsSidebarHovered(false);
    setIsSidebarFocused(false);
  }, []);

  useEffect(() => {
    collapseSidebar();
  }, [collapseSidebar, location.pathname]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-current-width",
      isSidebarExpanded ? "var(--sidebar-expanded-width)" : "var(--sidebar-collapsed-width)",
    );
  }, [isSidebarExpanded]);

  useEffect(
    () => () => {
      document.documentElement.style.setProperty(
        "--sidebar-current-width",
        "var(--sidebar-collapsed-width)",
      );
    },
    [],
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-canvas"
      data-sidebar-expanded={isSidebarExpanded ? "true" : "false"}
    >
      <AppHeader />
      <AppSidebar
        expanded={isSidebarExpanded}
        permissions={permissions}
        onHoverChange={setIsSidebarHovered}
        onFocusWithinChange={setIsSidebarFocused}
        onNavigate={collapseSidebar}
      />
      <main
        id="app-scroll-container"
        className="app-scrollbar absolute bottom-0 left-[var(--sidebar-current-width)] right-0 top-[var(--header-height)] min-w-0 overflow-x-hidden overflow-y-auto transition-[left] duration-150 ease-out motion-reduce:transition-none"
      >
        <div className="app-content-shell min-h-full min-w-0">
          <Outlet />
        </div>
      </main>
      <ScrollRestoration />
    </div>
  );
}
