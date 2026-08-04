import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { PermissionBadge } from "@/features/access/components/permission-badge";
import type { AccessItem, AccessTone } from "@/features/access/model/access.types";
import { cn } from "@/shared/lib/cn";

const toneClassNames: Record<AccessTone, string> = {
  blue: "access-tone-blue",
  violet: "access-tone-violet",
  emerald: "access-tone-emerald",
  amber: "access-tone-amber",
};

export function AccessCard({
  access,
  onViewPermissions,
}: {
  access: AccessItem;
  onViewPermissions: () => void;
}) {
  const Icon = access.icon;
  const disabled = access.level === "restricted" || access.level === "maintenance";

  const enter = () => {
    if (!disabled) window.location.assign(access.destination);
  };

  return (
    <motion.article
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ duration: 0.18 }}
      className={cn(
        toneClassNames[access.tone],
        "flex min-h-[315px] flex-col rounded-[var(--radius-lg)] border",
        "border-[var(--color-border)] bg-[var(--color-surface)] p-[21px]",
        "shadow-[var(--shadow-access-card)] transition",
        "hover:border-[var(--accent-color-border)] hover:shadow-[var(--shadow-card-hover)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent-color-soft)] text-[var(--accent-color)]">
          <Icon className="h-5 w-5" strokeWidth={2.1} />
        </span>
        <PermissionBadge
          label={access.badgeLabel ?? (access.level === "limited" ? "Acceso limitado" : "Acceso completo")}
          tone={access.tone}
        />
      </div>

      <div className="mt-4 min-w-0">
        <Typography as="h3" variant="cardTitle">
          {access.title}
        </Typography>
        <p className="mt-1 truncate text-[13px] leading-5 text-[var(--color-text-secondary)]" title={access.description}>
          {access.description}
        </p>
        <div className="mt-1 flex min-w-0 flex-wrap items-center text-[12px] leading-5 text-[var(--color-text-secondary)]">
          {access.modules.map((module, index) => (
            <span key={module} className="inline-flex items-center">
              {index > 0 ? <span className="px-1">·</span> : null}
              <span>{module}</span>
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-3 space-y-[6px]" aria-label={`Permisos de ${access.title}`}>
        {access.permissions.map((permission) => (
          <li key={permission} className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" strokeWidth={2.4} />
            <span>{permission}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onViewPermissions}
          className="focus-ring rounded-sm text-[12px] font-semibold-token text-[var(--accent-color)] underline decoration-[var(--accent-color-decoration)] decoration-1 underline-offset-4 transition hover:opacity-80"
        >
          Ver permisos
        </button>

        <Button variant="accent" onClick={enter} disabled={disabled} className="text-[13px]">
          {access.buttonLabel ?? "Ingresar"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.article>
  );
}
