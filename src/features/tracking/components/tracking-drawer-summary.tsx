import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { ATTENTION_STATUS_CATALOG } from "@/features/attentions/model/attention.catalogs";
import type { Attention } from "@/features/attentions/model/attention.types";
import { ClipboardList, FileText, ShieldAlert, UserRound } from "lucide-react";

type TrackingDrawerSummaryProps = {
  attention: Attention;
  canUpdate: boolean;
  statusId: string;
  onStatusIdChange: (value: string) => void;
  instance: string;
  onInstanceChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
};

export function TrackingDrawerSummary({
  attention,
  canUpdate,
  statusId,
  onStatusIdChange,
  instance,
  onInstanceChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  description,
  onDescriptionChange,
}: TrackingDrawerSummaryProps) {
  return (
    <div className="space-y-4 p-5 sm:p-6">
      {!canUpdate ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Su cuenta puede consultar esta atención, pero no tiene permiso para
            actualizarla.
          </p>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ClipboardList className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900">Estado y gestión</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Estatus"
            value={statusId}
            onValueChange={onStatusIdChange}
            disabled={!canUpdate}
            placeholder="Sin estatus"
            options={ATTENTION_STATUS_CATALOG.map((item) => ({
              label: item.label,
              value: String(item.id),
            }))}
          />

          <Input
            label="Institución, área o instancia"
            value={instance}
            onChange={(event) => onInstanceChange(event.target.value)}
            disabled={!canUpdate}
          />

          <Input
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={!canUpdate}
          />

          <Input
            type="tel"
            label="Teléfono"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            disabled={!canUpdate}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900">Descripción de la atención</h3>
        </div>

        <Textarea
          label="Observaciones"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          disabled={!canUpdate}
          className="min-h-32"
          placeholder="Descripción, solución o notas de la atención..."
        />

        <p className="mt-2 text-right text-xs text-slate-400">
          {description.length.toLocaleString("es-MX")} caracteres
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserRound className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900">Datos del registro</h3>
          <Badge tone="blue">Solo lectura</Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ReadonlyValue label="Solicitante" value={attention.requester} />
          <ReadonlyValue label="Tipo de caso" value={attention.caseType} />
          <ReadonlyValue label="Tipo de registro" value={attention.registry} />
          <ReadonlyValue label="Entidad" value={attention.entity} />
          <ReadonlyValue label="Fecha de atención" value={attention.date} />
          <ReadonlyValue label="Hora de atención" value={attention.time} />
        </div>
      </section>
    </div>
  );
}

function ReadonlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      <div className="min-h-10 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700">
        {value || "—"}
      </div>
    </div>
  );
}
