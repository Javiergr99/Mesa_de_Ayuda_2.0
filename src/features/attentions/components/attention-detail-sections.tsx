import { ClipboardCheck, FileText, FileX2, Info, MapPin, Paperclip, UserRound } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/ui/section-card";
import type { Attention, AttentionFile } from "@/features/attentions/model/attention.types";

function formatDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatTime(value: string): string {
  return /^\d{2}:\d{2}/.test(value) ? value.slice(0, 5) : value;
}

function extensionFrom(file: AttentionFile): string {
  const extension = file.name.split(".").pop()?.trim().toUpperCase();
  return extension && extension.length <= 5 ? extension : "FILE";
}

export function AttentionPersonSection({ attention }: { attention: Attention }) {
  const raw = attention.raw;

  return (
    <SectionCard title="Datos de la persona" icon={<UserRound className="h-4 w-4" />}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ReadonlyValue label="Nombre(s)" value={raw.nombre ?? attention.requester} />
        <ReadonlyValue label="Primer apellido" value={raw.primer_apellido ?? "—"} />
        <ReadonlyValue label="Segundo apellido" value={raw.segundo_apellido ?? "—"} />
        <ReadonlyValue label="Correo electrónico" value={attention.email} />
        <ReadonlyValue label="Teléfono" value={attention.phone} />
      </div>
    </SectionCard>
  );
}

export function AttentionContextSection({ attention }: { attention: Attention }) {
  return (
    <SectionCard title="Ubicación e institución" icon={<MapPin className="h-4 w-4" />}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ReadonlyValue label="Estado / PFPNNA" value={attention.entity} />
        <ReadonlyValue label="Institución, área o instancia" value={attention.instance} />
        <ReadonlyValue label="Fecha de atención" value={formatDate(attention.date)} />
        <ReadonlyValue label="Hora de atención" value={formatTime(attention.time)} />
      </div>
    </SectionCard>
  );
}

export function AttentionRequestSection({ attention }: { attention: Attention }) {
  return (
    <SectionCard title="Detalles de la atención" icon={<ClipboardCheck className="h-4 w-4" />}>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">Tipo de registro</p>
        <Badge tone="blue">{attention.registry}</Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ReadonlyValue
          label="Tipo de atención"
          value={attention.caseType}
          className="xl:col-span-2"
        />
        <ReadonlyValue label="Estatus" value={attention.status} />
        <ReadonlyValue label="Fecha de registro" value={attention.createdAt} />
      </div>

      <div className="mt-4">
        <ReadonlyValue label="Observaciones" value={attention.description} multiline />
      </div>
    </SectionCard>
  );
}

export function AttentionFilesSection({
  files,
  isPending,
  error,
}: {
  files: AttentionFile[];
  isPending: boolean;
  error: unknown;
}) {
  return (
    <SectionCard title="Archivos adjuntos" icon={<Paperclip className="h-4 w-4" />}>
      {isPending ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Consultando archivos activos…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : "No fue posible consultar los archivos."}
        </div>
      ) : files.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-3"
            >
              <span className="grid h-10 min-w-10 place-items-center rounded-lg bg-blue-50 px-2 text-[10px] font-extrabold text-blue-600">
                {extensionFrom(file)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {file.size} · {file.date}
                </p>
              </div>

              <Badge tone="slate">Solo metadatos</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
          <div>
            <FileX2 className="mx-auto h-7 w-7 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">
              No se adjuntaron archivos a esta atención.
            </p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

export function AttentionAdminSection({
  attention,
  registeredBy,
}: {
  attention: Attention;
  registeredBy?: string;
}) {
  return (
    <>
      <SectionCard title="Información administrativa" icon={<FileText className="h-4 w-4" />}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ReadonlyValue label="Referencia" value={attention.reference} />
          <ReadonlyValue label="Fecha de creación" value={attention.createdAt} />
          <ReadonlyValue label="Última modificación" value={attention.updatedAt} />

          {registeredBy ? <ReadonlyValue label="Registrado por" value={registeredBy} /> : null}
        </div>
      </SectionCard>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Este registro se muestra en modo de consulta. Para actualizar su estatus o agregar
          información, ingrese al módulo{" "}
          <Link to="/app/seguimiento" className="font-bold hover:underline">
            Seguimiento
          </Link>
          .
        </p>
      </div>
    </>
  );
}

function ReadonlyValue({
  label,
  value,
  multiline = false,
  className = "",
}: {
  label: string;
  value: string;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>

      <div
        className={[
          "rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700",
          multiline ? "min-h-20 whitespace-pre-wrap leading-6" : "min-h-10",
        ].join(" ")}
      >
        {value || "—"}
      </div>
    </div>
  );
}
