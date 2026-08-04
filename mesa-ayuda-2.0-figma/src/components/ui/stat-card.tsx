import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/cn";

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  slate: "bg-slate-100 text-slate-600",
  red: "bg-red-50 text-red-600",
} as const;

export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <Card className="h-full p-5 transition-colors hover:border-slate-300">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <span className={cn("grid h-9 w-9 place-items-center rounded-lg", toneClasses[tone])}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </Card>
    </motion.div>
  );
}
