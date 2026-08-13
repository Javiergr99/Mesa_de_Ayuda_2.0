import { Eye, FileText, LockKeyhole, Mail, Printer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { SectionCard } from "@/components/ui/section-card";
import { useAttentionFiles } from "@/features/attentions/api/attentions.queries";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import type { Attention } from "@/features/attentions/model/attention.types";

function ReadonlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

export function AttentionReadonlyDrawer({
  attention,
  open,
  onOpenChange,
}: {
  attention: Attention | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const filesQuery = useAttentionFiles(open ? attention?.id : null);
  if (!attention) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={`Detalle de la atención · ${attention.reference}`}
      description="Consulta construida con el objeto obtenido del listado; la API actual no expone GET individual por id."
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs text-blue-700">
            <LockKeyhole className="h-4 w-4" /> Registro en modo de consulta
          </span>
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
        </div>
      }
    >
      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <Badge tone="blue">{attention.registry}</Badge>
          <StatusBadge status={attention.status} />
          <span className="ml-auto text-sm font-bold text-blue-700">{attention.reference}</span>
        </div>

        <SectionCard title="Datos de la persona" icon={<Eye className="h-4 w-4" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <ReadonlyValue label="Nombre completo" value={attention.requester} />
            <ReadonlyValue label="Correo electrónico" value={attention.email} />
            <ReadonlyValue label="Teléfono" value={attention.phone} />
            <ReadonlyValue label="Instancia" value={attention.instance} />
          </div>
        </SectionCard>

        <SectionCard title="Clasificación y control" icon={<FileText className="h-4 w-4" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <ReadonlyValue label="Tipo de caso" value={attention.caseType} />
            <ReadonlyValue label="Tipo de registro" value={attention.registry} />
            <ReadonlyValue label="Entidad" value={attention.entity} />
            <ReadonlyValue label="Estatus" value={attention.status} />
            <ReadonlyValue label="Fecha de atención" value={attention.date} />
            <ReadonlyValue label="Hora de atención" value={attention.time} />
            <ReadonlyValue label="Creado por (UUID)" value={attention.createdBy} />
            <ReadonlyValue label="Atendido por (UUID)" value={attention.attendedBy} />
            <ReadonlyValue label="Fecha de registro" value={attention.createdAt} />
            <ReadonlyValue label="Última actualización" value={attention.updatedAt} />
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-700">
            {attention.description}
          </div>
        </SectionCard>

        <SectionCard title="Archivos adjuntos" icon={<FileText className="h-4 w-4" />}>
          {filesQuery.isPending ? (
            <p className="text-sm text-slate-500">Consultando archivos activos…</p>
          ) : filesQuery.error ? (
            <p className="text-sm text-red-600">
              {filesQuery.error instanceof Error ? filesQuery.error.message : "No fue posible consultar los archivos."}
            </p>
          ) : filesQuery.data?.length ? (
            <div className="space-y-2">
              {filesQuery.data.map((file) => (
                <div key={file.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    {file.isEmail ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size} · {file.date}</p>
                  </div>
                  <Badge tone="slate">Solo metadatos</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No hay archivos activos relacionados con esta atención.</p>
          )}
          <p className="mt-3 text-xs leading-5 text-slate-500">
            El contrato actual permite listar y reemplazar archivos, pero no incluye un endpoint de descarga individual.
          </p>
        </SectionCard>
      </div>
    </Drawer>
  );
}
