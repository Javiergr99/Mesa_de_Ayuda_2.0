import { Button } from "@/components/ui/button";
import { AttentionResultDialog } from "@/features/attention-create/components/attention-result-dialog";
import { AlertCircle, RefreshCw, TriangleAlert } from "lucide-react";

export type AttentionCreateFailureKind = "request" | "connection";

export function AttentionCreateErrorDialog({
  open,
  onOpenChange,
  kind,
  message,
  busy,
  onRetry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: AttentionCreateFailureKind;
  message: string;
  busy: boolean;
  onRetry: () => void;
}) {
  const connectionFailure = kind === "connection";

  return (
    <AttentionResultDialog
      open={open}
      onOpenChange={onOpenChange}
      tone={connectionFailure ? "warning" : "error"}
      icon={
        connectionFailure ? (
          <TriangleAlert className="h-7 w-7" />
        ) : (
          <AlertCircle className="h-7 w-7" />
        )
      }
      title={
        connectionFailure ? "Sin conexión con el servidor" : "No fue posible registrar la atención"
      }
      description={
        connectionFailure
          ? "No fue posible completar el registro. Verifique su conexión e intente nuevamente."
          : "Ocurrió un problema al guardar la información. Los datos capturados se conservaron para que pueda intentarlo nuevamente."
      }
      actions={
        <>
          <Button type="button" className="w-full" onClick={onRetry} disabled={busy}>
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
            {busy
              ? "Intentando nuevamente..."
              : connectionFailure
                ? "Reintentar"
                : "Intentar nuevamente"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            {connectionFailure ? "Continuar editando" : "Revisar información"}
          </Button>
        </>
      }
    >
      {connectionFailure ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 px-3.5 py-3 text-left text-xs leading-5 text-blue-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>La información capturada permanecerá disponible en esta pantalla.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 px-3.5 py-3 text-center text-xs leading-5 text-slate-400">
          Error técnico: {message}
        </div>
      )}
    </AttentionResultDialog>
  );
}
