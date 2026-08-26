import { LockKeyhole, UserRound } from "lucide-react";

function AssignmentField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "user" | "lock";
}) {
  const Icon = icon === "user" ? UserRound : LockKeyhole;

  return (
    <div className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ui-text-secondary)]">
        <Icon className="h-4 w-4 text-[var(--ui-primary)]" aria-hidden="true" />
        <span>{label}</span>
      </div>

      <p
        className="mt-2 truncate text-sm font-semibold text-[var(--ui-text-primary)]"
        title={value || undefined}
      >
        {value || "—"}
      </p>
    </div>
  );
}

export function SystemAssignmentSummary({ userName }: { userName: string }) {
  const displayName = userName.trim();

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <AssignmentField label="Atendido por" value={displayName} icon="user" />

      <AssignmentField label="Creado por" value={displayName} icon="lock" />
    </div>
  );
}
