import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, LogOut, ShieldCheck, UserRound } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { performLogout } from "@/features/auth/services/session-security";

const navigationItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Por Tus Derechos", href: "#por-tus-derechos" },
  { label: "Micrositio", href: "#micrositio" },
  { label: "Agenda", href: "#agenda" },
] as const;

/**
 * Encabezado privado de Mesa de Ayuda 2.0.
 * Se utiliza únicamente después de completar la autenticación.
 */
export function AppHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--header-height)] border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-5 px-6">
        <div className="min-w-0 justify-self-start">
          <Logo to="/accesos" />
        </div>

        <nav
          className="hidden items-center justify-center gap-8 lg:flex"
          aria-label="Navegación superior de Mesa de Ayuda"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="focus-ring rounded-md px-1 py-2 text-sm font-semibold-token text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-self-end gap-4">
          <button
            type="button"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            aria-label="Notificaciones"
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>

          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="focus-ring flex min-w-0 items-center gap-2.5 rounded-lg px-1 py-1 text-left transition hover:bg-[var(--color-surface-muted)]"
                  aria-label="Abrir opciones del perfil"
                >
                  <UserAvatar name={user.name} className="h-9 w-9 text-[11px]" />
                  <span className="hidden min-w-0 leading-tight sm:block">
                    <strong className="block truncate text-[13px] font-bold-token text-[var(--color-text-primary)]">
                      {user.name}
                    </strong>
                    <span className="mt-0.5 block truncate text-[11px] text-[var(--color-text-secondary)]">
                      {user.role}
                    </span>
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={9}
                  className="z-[70] min-w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-xl"
                >
                  <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold-token uppercase tracking-wide text-[var(--color-text-muted)]">
                    Cuenta
                  </DropdownMenu.Label>
                  <DropdownMenu.Item className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none hover:bg-[var(--color-surface-muted)]">
                    <UserRound className="h-4 w-4" /> Perfil
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none hover:bg-[var(--color-surface-muted)]">
                    <ShieldCheck className="h-4 w-4" /> Seguridad
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-surface-subtle)]" />
                  <DropdownMenu.Item
                    onSelect={() => void performLogout()}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-error)] outline-none hover:bg-[var(--color-error-soft)]"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : null}
        </div>
      </div>
    </header>
  );
}
