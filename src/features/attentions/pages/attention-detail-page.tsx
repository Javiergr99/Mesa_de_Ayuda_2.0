import { ArrowLeft, Download, FileQuestion, Printer } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { useAttentionFiles } from "@/features/attentions/api/attentions.queries";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import {
  AttentionAdminSection,
  AttentionContextSection,
  AttentionFilesSection,
  AttentionPersonSection,
  AttentionRequestSection,
} from "@/features/attentions/components/attention-detail-sections";
import type { Attention, AttentionFile } from "@/features/attentions/model/attention.types";
import { Badge } from "@/components/ui/badge";

type AttentionDetailRouteState = {
  attention?: Attention;
  registeredBy?: string;
};

function exportAttention(attention: Attention, files: AttentionFile[]) {
  const data = {
    reference: attention.reference,
    createdAt: attention.createdAt,
    updatedAt: attention.updatedAt,
    date: attention.date,
    time: attention.time,
    requester: attention.requester,
    email: attention.email,
    phone: attention.phone,
    instance: attention.instance,
    observations: attention.description,
    entity: attention.entity,
    status: attention.status,
    caseType: attention.caseType,
    registry: attention.registry,
    files,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `atencion-${attention.reference.replaceAll("…", "-")}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function AttentionDetailPage() {
  const { attentionId } = useParams();
  const location = useLocation();
  const routeState = location.state as AttentionDetailRouteState | null;
  const routeAttention = routeState?.attention ?? null;
  const attention = routeAttention?.id === attentionId ? routeAttention : null;

  const filesQuery = useAttentionFiles(attention?.id);

  if (!attention) {
    return (
      <div className="app-page">
        <PageHeading
          eyebrow={
            <>
              <span>Dashboard</span> <span className="px-1">›</span> <span>Atenciones</span>{" "}
              <span className="px-1">›</span> <span className="text-blue-600">Detalle</span>
            </>
          }
          title="Detalle de la atención"
          description="Consulte la información registrada en modo de solo lectura."
          actions={
            <Button asChild variant="secondary">
              <Link to="/app/atenciones">
                <ArrowLeft className="h-4 w-4" />
                Regresar
              </Link>
            </Button>
          }
        />

        <Card>
          <EmptyState
            icon={FileQuestion}
            title="No fue posible recuperar el registro"
            description="Abra nuevamente la atención desde el listado para consultar su detalle. La API disponible todavía no expone una consulta individual por identificador."
            tone="slate"
            size="lg"
            action={
              <Button variant="secondary" asChild>
                <Link to="/app/atenciones">Volver a Atenciones</Link>
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const files = filesQuery.data ?? [];

  return (
    <div className="app-page">
      <PageHeading
        eyebrow={
          <>
            <span>Dashboard</span> <span className="px-1">›</span> <span>Atenciones</span>{" "}
            <span className="px-1">›</span> <span className="text-blue-600">Detalle</span>
          </>
        }
        title={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span>Detalle de la atención</span>
            <span className="text-blue-600">{attention.reference}</span>
            <StatusBadge status={attention.status} />
            <Badge tone="blue">{attention.registry}</Badge>
          </span>
        }
        actions={
          <>
            <Button asChild variant="secondary">
              <Link to="/app/atenciones">
                <ArrowLeft className="h-4 w-4" />
                Regresar
              </Link>
            </Button>

            <Button type="button" variant="secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => exportAttention(attention, files)}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </>
        }
      />

      <AttentionPersonSection attention={attention} />
      <AttentionContextSection attention={attention} />
      <AttentionRequestSection attention={attention} />

      <AttentionFilesSection
        files={files}
        isPending={filesQuery.isPending}
        error={filesQuery.error}
      />

      <AttentionAdminSection attention={attention} registeredBy={routeState?.registeredBy} />
    </div>
  );
}
