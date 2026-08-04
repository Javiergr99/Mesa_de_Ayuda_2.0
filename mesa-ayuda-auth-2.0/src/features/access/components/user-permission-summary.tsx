import { UserAvatar } from "@/components/ui/user-avatar";
import { Typography } from "@/components/ui/typography";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function UserPermissionSummary() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <section
      className="flex min-h-[92px] flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-user-summary)] sm:flex-row sm:items-center"
      aria-label="Resumen del usuario autenticado"
    >
      <UserAvatar name={user.name} className="h-[52px] w-[52px] text-xs" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <Typography as="h2" variant="cardTitle" className="text-[17px]">
            {user.name}
          </Typography>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-success-soft)] px-2 py-1 text-[11px] font-semibold-token leading-none text-[var(--color-success-foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            Activa
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-y-2 text-[13px] text-[var(--color-text-secondary)]">
          <span className="pr-4">{user.role}</span>
          <span className="border-l border-[var(--color-border)] px-4">{user.area}</span>
          <span className="border-l border-[var(--color-border)] px-4">Ámbito: {user.scope}</span>
          <span className="border-l border-[var(--color-border)] pl-4">Último acceso: 03/08/2026 - 17:42</span>
        </div>
      </div>
    </section>
  );
}
