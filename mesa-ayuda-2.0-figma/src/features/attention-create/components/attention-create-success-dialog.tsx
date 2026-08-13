import {
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Attention } from "@/features/attentions/model/attention.types";

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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Atención registrada correctamente"
      description="La bitácora fue creada en API Mesa de Ayuda."
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCreateAnother}
          >
            Registrar otra atención
          </Button>

          <Button asChild>
            <Link to="/app/atenciones">
              <CheckCircle2 className="h-4 w-4" />
              Ver bitácora
            </Link>
          </Button>
        </>
      }
    >
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>

        <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-left sm:grid-cols-2">
          <SummaryValue
            label="Identificador"
            value={attention?.id ?? "—"}
            valueClassName="break-all text-blue-700"
          />
          <SummaryValue
            label="Estatus"
            value={
              attention?.status ??
              "Sin estatus"
            }
          />
          <SummaryValue
            label="Entidad"
            value={
              attention?.entity ??
              "Sin entidad"
            }
          />
          <SummaryValue
            label="Tipo de registro"
            value={
              attention?.registry ?? "—"
            }
          />
          <SummaryValue
            label="Registrado por"
            value={userName}
          />
        </div>

        {uploadWarnings.length ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-800">
            La bitácora fue creada, pero
            algunos archivos no pudieron
            adjuntarse:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {uploadWarnings.map(
                (warning) => (
                  <li key={warning}>
                    {warning}
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

function SummaryValue({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 font-bold text-slate-800 ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}
