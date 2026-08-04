import { Download, Eye, FileText, LockKeyhole, Printer } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/ui/section-card";
import { PriorityBadge, StatusBadge } from "@/features/attentions/components/attention-badges";
import type { Attention } from "@/features/attentions/model/attention.types";

function ReadonlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value || "—"}</p>
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
  if (!attention) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={`Detalle de la atención · ${attention.folio}`}
      description="Consulta de la información capturada."
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs text-blue-700">
            <LockKeyhole className="h-4 w-4" /> Registro en modo de consulta
          </span>
          <div className="flex gap-2">
            <Button variant="secondary"><Printer className="h-4 w-4" /> Imprimir</Button>
            <Button variant="secondary"><Download className="h-4 w-4" /> Exportar</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <Badge tone="blue">{attention.registry}</Badge>
          <StatusBadge status={attention.status} />
          <PriorityBadge priority={attention.priority} />
          <span className="ml-auto text-sm font-bold text-blue-700">{attention.folio}</span>
        </div>

        <SectionCard title="Datos de la persona" icon={<Eye className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            <ReadonlyValue label="Nombre completo" value={attention.requester} />
            <ReadonlyValue label="Nombre de usuario" value={attention.username} />
            <ReadonlyValue label="Correo electrónico" value={attention.email} />
            <ReadonlyValue label="Teléfono" value={attention.phone} />
            <ReadonlyValue label="Extensión" value={attention.extension} />
            <ReadonlyValue label="Perfil" value={attention.profile} />
          </div>
        </SectionCard>

        <SectionCard title="Ubicación e institución" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            <ReadonlyValue label="Ámbito" value={attention.scope} />
            <ReadonlyValue label="Estado" value={attention.state} />
            <ReadonlyValue label="Municipio" value={attention.municipality} />
            <ReadonlyValue label="Área de adscripción" value={attention.area} />
          </div>
        </SectionCard>

        <SectionCard title="Detalles de la solicitud" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            <ReadonlyValue label="Tipo de atención" value={attention.type} />
            <ReadonlyValue label="Responsable" value={attention.responsible} />
            <ReadonlyValue label="Fecha de registro" value={attention.createdAt} />
            <ReadonlyValue label="Última actualización" value={attention.updatedAt} />
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-700">
            {attention.description}
          </div>
        </SectionCard>

        <SectionCard title="Archivos adjuntos" icon={<FileText className="h-4 w-4" />}>
          {attention.files.length ? (
            <div className="space-y-2">
              {attention.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><FileText className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size} · {file.date}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Descargar ${file.name}`}><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No se adjuntaron archivos a esta atención.</p>
          )}
        </SectionCard>
      </div>
    </Drawer>
  );
}
