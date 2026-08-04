import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

import { AccessLayout } from "@/components/layout/access-layout";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { accessRepository } from "@/features/access/api/access.repository";
import { AccessCard } from "@/features/access/components/access-card";
import { AccessCardSkeleton } from "@/features/access/components/access-card-skeleton";
import { PermissionDialog } from "@/features/access/components/permission-dialog";
import { UserPermissionSummary } from "@/features/access/components/user-permission-summary";
import type { AccessItem } from "@/features/access/model/access.types";

export function AccessPage() {
  const [selectedAccess, setSelectedAccess] = useState<AccessItem | null>(null);
  const query = useQuery({
    queryKey: ["accesses"],
    queryFn: accessRepository.getAccesses,
  });

  return (
    <AccessLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <header>
          <p className="text-[12px] font-medium-token text-[var(--color-text-secondary)]">
            Inicio <span className="px-1 text-[var(--color-text-muted)]">›</span>
            <span className="text-[var(--color-primary)]">Accesos disponibles</span>
          </p>
          <Typography as="h1" variant="pageTitle" className="mt-1">
            Accesos disponibles
          </Typography>
        </header>

        <div className="mt-4">
          <UserPermissionSummary />
        </div>

        <section className="mt-4" aria-labelledby="access-title">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <Typography as="h2" id="access-title" variant="sectionTitle">
                Áreas autorizadas
              </Typography>
              <Typography variant="bodyMuted" className="mt-0.5 text-[13px]">
                Acceda a las funciones habilitadas para su perfil.
              </Typography>
            </div>

            <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[12px] font-semibold-token text-[var(--color-primary)]">
              {query.data?.length ?? 0} accesos disponibles
            </span>
          </div>

          {query.isError ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--palette-red-200)] bg-[var(--color-surface)] p-10 text-center">
              <Typography as="h3" variant="cardTitle">
                No fue posible cargar sus accesos
              </Typography>
              <Typography variant="bodyMuted" className="mt-2">
                Ocurrió un problema al consultar los permisos asociados a su cuenta.
              </Typography>
              <Button onClick={() => void query.refetch()} className="mt-5">
                Intentar nuevamente
              </Button>
            </div>
          ) : (
            <div className="grid gap-[22px] lg:grid-cols-2">
              {query.isLoading
                ? Array.from({ length: 4 }, (_, index) => <AccessCardSkeleton key={index} />)
                : query.data?.map((access) => (
                    <AccessCard
                      key={access.id}
                      access={access}
                      onViewPermissions={() => setSelectedAccess(access)}
                    />
                  ))}
            </div>
          )}
        </section>
      </motion.div>

      <PermissionDialog
        access={selectedAccess}
        open={Boolean(selectedAccess)}
        onOpenChange={(open) => {
          if (!open) setSelectedAccess(null);
        }}
      />
    </AccessLayout>
  );
}
