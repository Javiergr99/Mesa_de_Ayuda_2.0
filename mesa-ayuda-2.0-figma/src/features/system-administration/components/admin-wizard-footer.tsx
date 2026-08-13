import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function AdminWizardFooter({
  onCancel,
  onPrevious,
  onNext,
  nextLabel = "Siguiente",
  nextDisabled,
  nextIcon,
}: {
  onCancel: () => void;
  onPrevious?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextIcon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--ui-border)] px-6 py-4">
      <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
      <div className="flex items-center gap-3">
        {onPrevious ? <Button variant="secondary" onClick={onPrevious}>Anterior</Button> : null}
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextIcon}
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
