import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/shared/lib/cn";

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[var(--z-modal)] bg-[var(--overlay-modal)] backdrop-blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[calc(100%-2rem)] max-w-lg",
                  "-translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)]",
                  "border border-[var(--color-border)] bg-[var(--color-surface)]",
                  "shadow-[var(--shadow-modal)] outline-none",
                  className,
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] px-6 py-5">
                  <div>
                    <DialogPrimitive.Title className="text-lg font-bold-token text-[var(--color-text-primary)]">
                      {title}
                    </DialogPrimitive.Title>
                    {description ? (
                      <DialogPrimitive.Description className="mt-1 text-sm leading-5 text-[var(--color-text-secondary)]">
                        {description}
                      </DialogPrimitive.Description>
                    ) : null}
                  </div>
                  <DialogPrimitive.Close
                    className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
                    aria-label="Cerrar"
                  >
                    <X className="h-4.5 w-4.5" />
                  </DialogPrimitive.Close>
                </div>
                {children ? <div className="px-6 py-5">{children}</div> : null}
                {footer ? (
                  <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--color-border-subtle)] px-6 py-4">
                    {footer}
                  </div>
                ) : null}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
