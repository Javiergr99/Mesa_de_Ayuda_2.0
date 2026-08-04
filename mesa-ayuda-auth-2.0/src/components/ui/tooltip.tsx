import type { ReactElement } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function Tooltip({ content, children }: { content: string; children: ReactElement }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={6}
          className="z-[var(--z-drawer)] rounded-[var(--radius-sm)] bg-[var(--palette-slate-900)] px-2.5 py-1.5 text-xs font-medium-token text-white shadow-lg"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-[var(--palette-slate-900)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
