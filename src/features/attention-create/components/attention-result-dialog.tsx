import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type ResultTone = "success" | "error" | "warning";

const TONE_CLASSES: Record<ResultTone, string> = {
  success: "bg-emerald-50 text-emerald-500",
  error: "bg-red-50 text-red-500",
  warning: "bg-amber-50 text-amber-500",
};

export function AttentionResultDialog({
  open,
  onOpenChange,
  tone,
  icon,
  title,
  description,
  children,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tone: ResultTone;
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-[1px]" />

        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[51] w-[calc(100%-2rem)] max-w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-2xl focus:outline-none sm:px-7"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <div className="text-center">
            <span
              className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${TONE_CLASSES[tone]}`}
              aria-hidden="true"
            >
              {icon}
            </span>

            <DialogPrimitive.Title className="mt-5 text-xl font-bold tracking-tight text-slate-950">
              {title}
            </DialogPrimitive.Title>

            <DialogPrimitive.Description className="mx-auto mt-2 max-w-[340px] text-sm leading-5 text-slate-500">
              {description}
            </DialogPrimitive.Description>
          </div>

          {children ? <div className="mt-5">{children}</div> : null}

          <div className="mt-5 space-y-2.5">{actions}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
