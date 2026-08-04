import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full bg-[var(--badge-background)] px-2.5 py-1 text-xs font-semibold-token text-[var(--badge-foreground)]",
  {
    variants: {
      tone: {
        blue: "badge-tone-blue",
        green: "badge-tone-green",
        amber: "badge-tone-amber",
        violet: "badge-tone-violet",
        red: "badge-tone-red",
        slate: "badge-tone-slate",
      },
    },
    defaultVariants: { tone: "blue" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
