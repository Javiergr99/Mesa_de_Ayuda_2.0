import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Activity,
  Bell,
  ChevronDown,
  LogOut,
  Palette,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, NavLink } from "react-router";

import { useAuthStore } from "@/features/auth/model/auth.store";
import {
  getUserDisplayName,
  getUserInitials,
  getUserRoleLabel,
  userHasAction,
} from "@/features/auth/model/auth.selectors";
import { logoutCurrentSession } from "@/features/auth/components/auth-session-provider";
import { AccessHubButton } from "@/components/layout/access-hub-button";
import { topNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";

export function AppHeader() {
  const user = useAuthStore((state) => state.user);
  const displayName = getUserDisplayName(user);
  const roleLabel = getUserRoleLabel(user);
  const initials = getUserInitials(user);
  const canOpenAppearance = userHasAction(user, "ADMINISTRAR_USUARIOS");

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[var(--header-height)] items-center border-b border-[var(--ui-border)] bg-[var(--ui-header)] px-6">
      <Link to="/app/dashboard" className="flex w-[calc(var(--sidebar-expanded-width)-24px)] shrink-0 items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--ui-primary)] text-white shadow-sm">
          <Activity className="h-5 w-5" />
        </span>
        <span className="leading-tight">
          <strong className="block text-base text-[var(--ui-text-primary)]">Mesa de Ayuda</strong>
          <span className="block text-[11px] font-bold text-[var(--ui-primary)]">v2.0</span>
        </span>
      </Link>

      <nav className="flex flex-1 items-center justify-center gap-9" aria-label="Navegación superior">
        {topNavigation.map((item) =>
          item.to.startsWith("#") ? (
            <a key={item.label} href={item.to} className="text-sm font-semibold text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)]">
              {item.label}
            </a>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)]",
                  isActive && "text-[var(--ui-primary)]",
                )
              }
            >
              {item.label}
            </NavLink>
          ),
        )}
      </nav>

      <div className="flex min-w-[340px] items-center justify-end gap-3">
        <AccessHubButton />
        <button className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100" aria-label="Notificaciones">
          <Bell className="h-4.5 w-4.5" />
        </button>
        <span className="h-8 w-px bg-[var(--ui-border)]" />

        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button className="focus-ring flex items-center gap-3 rounded-lg px-1 py-1 text-left hover:bg-slate-50" aria-label="Abrir opciones del perfil">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-blue-100 text-xs font-bold text-slate-700 ring-2 ring-white shadow-sm">
                {initials}
              </span>
              <span className="max-w-[180px] leading-tight">
                <strong className="block truncate text-sm text-[var(--ui-text-primary)]">{displayName}</strong>
                <span className="block truncate text-xs text-[var(--ui-text-secondary)]">{roleLabel}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="profile-menu-content z-50 min-w-72 origin-top-right rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-2 shadow-xl"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-bold text-[var(--ui-text-primary)]">{displayName}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--ui-text-secondary)]">{user?.correo_electronico}</p>
              </div>
              <DropdownMenu.Separator className="my-1 h-px bg-[var(--ui-border)]" />
              <DropdownMenu.Item asChild>
                <Link
                  to="/app/perfil"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--ui-text-secondary)] outline-none hover:bg-slate-50 hover:text-[var(--ui-text-primary)] focus:bg-slate-50"
                >
                  <UserRound className="h-4 w-4" /> Mi perfil
                </Link>
              </DropdownMenu.Item>
              {canOpenAppearance ? (
                <DropdownMenu.Item asChild>
                  <Link
                    to="/app/configuracion/apariencia"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--ui-text-secondary)] outline-none hover:bg-slate-50 hover:text-[var(--ui-text-primary)] focus:bg-slate-50"
                  >
                    <Palette className="h-4 w-4" /> Configuración visual
                  </Link>
                </DropdownMenu.Item>
              ) : null}
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--ui-text-secondary)]">
                <ShieldCheck className="h-4 w-4" /> Sesión protegida con 2FA
              </div>
              <DropdownMenu.Separator className="my-1 h-px bg-[var(--ui-border)]" />
              <DropdownMenu.Item
                onSelect={() => void logoutCurrentSession("manual")}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 outline-none hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
