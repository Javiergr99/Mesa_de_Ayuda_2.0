import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold",
  {
    variants: {
      tone: {
        blue: "bg-blue-50 text-blue-700",
        violet: "bg-violet-50 text-violet-700",
        amber: "bg-amber-50 text-amber-700",
        emerald: "bg-emerald-50 text-emerald-700",
        red: "bg-red-50 text-red-700",
        slate: "bg-slate-100 text-slate-700",
      },
    },
    defaultVariants: { tone: "slate" },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
