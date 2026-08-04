import { ShieldCheck } from "lucide-react";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { MfaVerifyForm } from "@/features/auth/components/mfa-verify-form";

export function MfaVerifyPage() {
  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Paso 2 de 2"
        title="Verifica tu identidad"
        description="Ingresa el código de seis dígitos generado por tu aplicación de autenticación."
        icon={<ShieldCheck className="h-6 w-6" />}
      >
        <MfaVerifyForm />
      </AuthCard>
    </AuthLayout>
  );
}
