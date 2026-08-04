import { useState } from "react";
import { Check, Clipboard, ShieldPlus } from "lucide-react";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { QrCode } from "@/components/ui/qr-code";
import { MfaVerifyForm } from "@/features/auth/components/mfa-verify-form";
import { DEMO_MFA_SECRET } from "@/shared/constants/demo";

export function MfaSetupPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySecret = async () => {
    await navigator.clipboard.writeText(DEMO_MFA_SECRET);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Paso 2 de 2"
        title="Configura la autenticación de dos factores"
        description="Escanea el código QR con Google Authenticator o Microsoft Authenticator."
        icon={<ShieldPlus className="h-6 w-6" />}
      >
        <div className="space-y-6">
          <div className="flex justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
            <QrCode />
          </div>
          <ol className="space-y-2 text-sm leading-5 text-[var(--color-text-secondary)]">
            {[
              "Abre tu aplicación de autenticación.",
              "Selecciona la opción para agregar una cuenta.",
              "Escanea el código QR.",
              "Ingresa el código de seis dígitos generado.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold-token text-[var(--color-primary)]">
                  {index + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>

          <div>
            <Button variant="ghost" size="sm" onClick={() => setShowSecret((current) => !current)}>
              ¿No puedes escanear el código? {showSecret ? "Ocultar clave" : "Mostrar clave"}
            </Button>
            {showSecret ? (
              <div className="mt-2 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                <code className="min-w-0 flex-1 break-all font-mono-token text-xs font-semibold-token text-[var(--color-text-primary)]">
                  {DEMO_MFA_SECRET}
                </code>
                <Button size="icon" variant="secondary" onClick={() => void copySecret()} aria-label="Copiar clave de configuración">
                  {copied ? <Check className="h-4 w-4 text-[var(--color-success)]" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            ) : null}
          </div>

          <MfaVerifyForm mode="setup" />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
