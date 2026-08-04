import { ShieldCheck } from "lucide-react";

export function SecurityNotice() {
  return (
    <div className="status-tone-info flex gap-3 rounded-[var(--radius-md)] border border-[var(--status-border)] bg-[var(--status-background)] p-4 text-[var(--status-foreground)]">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--status-icon)]" />
      <div>
        <p className="text-sm font-semibold-token">Acceso seguro</p>
        <p className="mt-1 text-sm leading-5 opacity-75">
          Los accesos mostrados corresponden a los permisos asignados a su cuenta. Las acciones realizadas en la plataforma quedan registradas para fines de seguridad y auditoría.
        </p>
      </div>
    </div>
  );
}
