import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Activity, Bell, ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router";

import { AccessHubButton } from "@/components/layout/access-hub-button";
import { useAuthStore } from "@/features/auth/model/auth.store";
import {
  getUserDisplayName,
  getUserInitials,
  getUserRoleLabel,
} from "@/features/auth/model/auth.selectors";
import { logoutCurrentSession } from "@/features/auth/services/auth-session-actions";

export function AppHeader() {
  const user = useAuthStore((state) => state.user);
  const displayName = getUserDisplayName(user);
  const roleLabel = getUserRoleLabel(user);
  const initials = getUserInitials(user);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[var(--header-height)] items-center border-b border-[var(--ui-border)] bg-[var(--ui-header)] px-3 sm:px-4 lg:px-6">
      <Link
        to="/app/dashboard"
        className="flex min-w-0 flex-1 items-center gap-3 sm:min-w-[240px] sm:flex-none lg:min-w-[285px]"
        aria-label="Ir al dashboard de Mesa de Ayuda"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--ui-primary)] text-white shadow-sm">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </span>

        <span className="hidden min-w-0 leading-tight sm:block">
          <strong className="block whitespace-nowrap text-[15px] font-bold text-[var(--ui-text-primary)]">
            Mesa de Ayuda
          </strong>
          <span className="mt-0.5 block text-[11px] font-bold text-[var(--ui-primary)]">v2.0</span>
        </span>
      </Link>

      <div className="hidden min-w-0 flex-1 sm:block" aria-hidden="true" />

      <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
        <AccessHubButton />

        <button
          type="button"
          className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notificaciones"
        >
          <Bell className="h-4.5 w-4.5" aria-hidden="true" />
        </button>

        <span className="hidden h-8 w-px bg-[var(--ui-border)] sm:block" />

        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="focus-ring flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition-colors hover:bg-slate-50 sm:gap-3 sm:px-1.5"
              aria-label="Abrir opciones del perfil"
              title={`${displayName} · ${roleLabel}`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-blue-100 text-xs font-bold text-slate-700 ring-2 ring-white shadow-sm">
                {initials}
              </span>

              <span className="hidden min-w-0 max-w-[210px] leading-tight lg:block 2xl:max-w-[240px]">
                <strong className="block truncate text-sm text-[var(--ui-text-primary)]">
                  {displayName}
                </strong>
                <span className="mt-0.5 block truncate text-xs text-[var(--ui-text-secondary)]">
                  {roleLabel}
                </span>
              </span>

              <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="profile-menu-content z-50 w-[min(20rem,calc(100vw-1rem))] origin-top-right rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-2 shadow-xl"
            >
              <div className="px-3 py-2.5">
                <p className="break-words text-sm font-bold leading-5 text-[var(--ui-text-primary)]">
                  {displayName}
                </p>
                <p className="mt-1 break-all text-xs leading-4 text-[var(--ui-text-secondary)]">
                  {user?.correo_electronico}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                  {roleLabel}
                </span>
              </div>

              <DropdownMenu.Separator className="my-1 h-px bg-[var(--ui-border)]" />

              <DropdownMenu.Item asChild>
                <Link
                  to="/app/perfil"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--ui-text-secondary)] outline-none hover:bg-slate-50 hover:text-[var(--ui-text-primary)] focus:bg-slate-50"
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" /> Mi perfil
                </Link>
              </DropdownMenu.Item>

              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--ui-text-secondary)]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Sesión protegida con 2FA
              </div>

              <DropdownMenu.Separator className="my-1 h-px bg-[var(--ui-border)]" />

              <DropdownMenu.Item
                onSelect={() => void logoutCurrentSession("manual")}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 outline-none hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Cerrar sesión
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
