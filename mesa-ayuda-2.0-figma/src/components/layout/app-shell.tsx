import { Outlet, ScrollRestoration } from "react-router";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppShell() {
  // El área principal es el único contenedor con desplazamiento para evitar scroll duplicado.
  return (
    <div className="fixed inset-0 overflow-hidden bg-canvas">
      <AppHeader />
      <AppSidebar />
      <main
        id="app-scroll-container"
        className="app-scrollbar absolute bottom-0 left-[var(--sidebar-width)] right-0 top-[var(--header-height)] overflow-x-hidden overflow-y-auto"
      >
        <div className="min-h-full px-7 py-7">
          <Outlet />
        </div>
      </main>
      <ScrollRestoration />
    </div>
  );
}
