import { Check, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import type { AccessItem } from "@/features/access/model/access.types";

export function PermissionDialog({
  access,
  open,
  onOpenChange,
}: {
  access: AccessItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!access) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Permisos asignados"
      description={`Consulta del alcance disponible para ${access.title}.`}
      footer={<Button variant="secondary" onClick={() => onOpenChange(false)}>Cerrar</Button>}
    >
      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-4 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-4 text-sm">
          <div>
            <dt className="text-xs font-semibold-token text-[var(--color-text-muted)]">Área</dt>
            <dd className="mt-1 font-semibold-token text-[var(--color-text-primary)]">{access.title}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold-token text-[var(--color-text-muted)]">Nivel</dt>
            <dd className="mt-1 font-semibold-token capitalize text-[var(--color-text-primary)]">
              {access.level === "full" ? "Completo" : "Limitado"}
            </dd>
          </div>
        </dl>
        <div>
          <Typography as="h3" variant="bodySm" className="font-bold-token">
            Permisos habilitados
          </Typography>
          <ul className="mt-3 space-y-2.5">
            {access.permissions.map((permission) => (
              <li key={permission} className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {permission}
              </li>
            ))}
            {access.level === "limited" ? (
              <li className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-surface-subtle)]">
                  <Minus className="h-3.5 w-3.5" />
                </span>
                Administrar configuración
              </li>
            ) : null}
          </ul>
        </div>
        <Typography variant="caption" className="leading-5">
          Esta pantalla es únicamente informativa. La asignación de permisos se realiza desde la administración institucional.
        </Typography>
      </div>
    </Dialog>
  );
}
