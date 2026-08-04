import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Clock3, HelpCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { Spinner } from "@/components/ui/spinner";
import { authRepository } from "@/features/auth/api/auth.repository";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function MfaVerifyForm({ mode = "verify" }: { mode?: "verify" | "setup" }) {
  const navigate = useNavigate();
  const tempToken = useAuthStore((state) => state.tempToken);
  const completeAuthentication = useAuthStore((state) => state.completeAuthentication);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: mode === "setup" ? authRepository.configureMfa : authRepository.verifyMfa,
    onSuccess: ({ user }) => {
      completeAuthentication(user);
      void navigate("/acceso-correcto");
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "No fue posible validar el código.");
    },
  });

  const submit = () => {
    if (!tempToken) {
      void navigate("/login", { replace: true });
      return;
    }
    if (code.length !== 6) {
      setError("Ingrese los seis dígitos del código de verificación.");
      return;
    }
    setError(null);
    mutation.mutate({ tempToken, code });
  };

  return (
    <div className="space-y-5">
      {error ? <Alert tone="error" title="Código no válido">{error}</Alert> : null}

      <OtpInput value={code} onChange={setCode} disabled={mutation.isPending} error={error ?? undefined} />

      <div className="status-tone-info flex gap-2.5 rounded-[var(--radius-md)] border border-[var(--status-border)] bg-[var(--status-background)] p-3.5 text-xs leading-5 text-[var(--status-foreground)]">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-icon)]" />
        <p>Los códigos cambian periódicamente. Mantén la fecha y hora de tu dispositivo configuradas automáticamente.</p>
      </div>

      <Button type="button" size="lg" fullWidth onClick={submit} disabled={mutation.isPending || code.length !== 6}>
        {mutation.isPending ? <><Spinner /> Validando código…</> : mode === "setup" ? "Verificar y continuar" : "Verificar identidad"}
      </Button>

      <div className="flex flex-col items-center gap-3 text-center text-sm">
        <Link
          to="/login"
          className="focus-ring rounded font-semibold-token text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          Regresar al inicio
        </Link>
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-1.5 rounded text-xs font-semibold-token text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          <HelpCircle className="h-3.5 w-3.5" /> Tengo problemas con mi código
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
        <ShieldCheck className="h-3.5 w-3.5" /> Compatible con Google Authenticator y Microsoft Authenticator
      </div>
    </div>
  );
}
