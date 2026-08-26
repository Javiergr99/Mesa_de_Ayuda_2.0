import { Button } from "@/components/ui/button";
import { AttentionResultDialog } from "@/features/attention-create/components/attention-result-dialog";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import type { Attention } from "@/features/attentions/model/attention.types";
import { CheckCircle2, Eye } from "lucide-react";
import { Link } from "react-router";

export function AttentionCreateSuccessDialog({
  open,
  onOpenChange,
  attention,
  uploadWarnings,
  userName,
  onCreateAnother,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attention: Attention | null;
  uploadWarnings: string[];
  userName: string;
  onCreateAnother: () => void;
}) {
  return (
    <AttentionResultDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="success"
      icon={<CheckCircle2 className="h-7 w-7" />}
      title="Atención registrada correctamente"
      description="La información se guardó de manera exitosa y ya se encuentra disponible para consulta."
      actions={
        <>
          {attention ? (
            <Button asChild className="w-full">
              <Link
                to={`/app/atenciones/${encodeURIComponent(attention.id)}`}
                state={{
                  attention,
                  registeredBy: userName,
                }}
              >
                <Eye className="h-4 w-4" />
                Ver registro
              </Link>
            </Button>
          ) : (
            <Button type="button" className="w-full" disabled>
              <Eye className="h-4 w-4" />
              Ver registro
            </Button>
          )}

          <Button type="button" variant="secondary" className="w-full" onClick={onCreateAnother}>
            Registrar otra atención
          </Button>

          <Button asChild variant="ghost" className="w-full text-blue-600">
            <Link to="/app/atenciones">Ir a Atenciones</Link>
          </Button>
        </>
      }
    >
      <div className="rounded-xl bg-slate-50 p-4 text-left">
        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <SummaryValue
            label="Referencia"
            value={attention?.reference ?? "—"}
            valueClassName="text-blue-600"
          />

          <SummaryValue
            label="Fecha de registro"
            value={attention?.createdAt ?? "—"}
            align="right"
          />

          <div>
            <p className="text-xs text-slate-400">Estatus inicial</p>
            <div className="mt-1.5">
              {attention ? (
                <StatusBadge status={attention.status} />
              ) : (
                <span className="text-sm font-semibold text-slate-700">—</span>
              )}
            </div>
          </div>

          <SummaryValue label="Tipo de registro" value={attention?.registry ?? "—"} align="right" />
        </div>
      </div>

      {uploadWarnings.length ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-800">
          La atención fue creada, pero algunos archivos no pudieron adjuntarse:
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            {uploadWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </AttentionResultDialog>
  );
}

function SummaryValue({
  label,
  value,
  valueClassName = "",
  align = "left",
}: {
  label: string;
  value: string;
  valueClassName?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "sm:text-right" : ""}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 break-words text-sm font-bold text-slate-800 ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}
