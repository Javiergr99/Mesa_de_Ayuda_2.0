import { Skeleton } from "@/components/ui/skeleton";

export function AccessCardSkeleton() {
  return (
    <div className="min-h-[315px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[21px] shadow-[var(--shadow-access-card)]">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9 rounded-[10px]" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-6 w-1/2" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mt-7 flex items-end justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-24 rounded-[var(--radius-sm)]" />
      </div>
    </div>
  );
}
