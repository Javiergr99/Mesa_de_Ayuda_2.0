import { Activity, Bell, ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router";

import { topNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";

export function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[var(--header-height)] items-center border-b border-slate-200 bg-white px-6">
      <Link to="/app/dashboard" className="flex w-[calc(var(--sidebar-width)-24px)] shrink-0 items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Activity className="h-5 w-5" />
        </span>
        <span className="leading-tight">
          <strong className="block text-base text-slate-900">Mesa de Ayuda</strong>
          <span className="block text-[11px] font-bold text-blue-600">v2.0</span>
        </span>
      </Link>

      <nav className="flex flex-1 items-center justify-center gap-9" aria-label="Navegación superior">
        {topNavigation.map((item) =>
          item.to.startsWith("#") ? (
            <a key={item.label} href={item.to} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
              {item.label}
            </a>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn("text-sm font-semibold text-slate-500 hover:text-slate-900", isActive && "text-slate-900")
              }
            >
              {item.label}
            </NavLink>
          ),
        )}
      </nav>

      <div className="flex min-w-[270px] items-center justify-end gap-4">
        <button className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100" aria-label="Notificaciones">
          <Bell className="h-4.5 w-4.5" />
        </button>
        <span className="h-8 w-px bg-slate-200" />
        <button className="focus-ring flex items-center gap-3 rounded-lg px-1 py-1 text-left hover:bg-slate-50" aria-label="Abrir opciones del perfil">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-blue-100 text-xs font-bold text-slate-700 ring-2 ring-white shadow-sm">
            SH
          </span>
          <span className="leading-tight">
            <strong className="block text-sm text-slate-900">Arq. Sofía Huerta</strong>
            <span className="block text-xs text-slate-500">Administrador</span>
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
