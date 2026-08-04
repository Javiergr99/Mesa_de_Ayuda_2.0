import { MailCheck } from "lucide-react";
import { Link } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

export function RecoverAccessPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Recuperar acceso"
        description="Ingresa tu correo institucional para recibir instrucciones de recuperación."
        icon={<MailCheck className="h-6 w-6" />}
      >
        <div className="space-y-5">
          <Alert tone="info" title="Proceso administrado">
            La recuperación real deberá validarse con el servicio institucional de usuarios.
          </Alert>
          <TextField label="Correo electrónico" type="email" placeholder="nombre@institucion.gob.mx" />
          <Button fullWidth size="lg">Enviar instrucciones</Button>
          <div className="text-center">
            <Link
              className="focus-ring rounded text-sm font-semibold-token text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              to="/login"
            >
              Regresar al inicio
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
