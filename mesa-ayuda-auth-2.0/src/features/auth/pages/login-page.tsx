import { useSearchParams } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert } from "@/components/ui/alert";
import { LoginForm } from "@/features/auth/components/login-form";

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const closedByInactivity = searchParams.get("reason") === "inactivity";

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Acceso seguro"
        title="Iniciar sesión"
        description="Ingresa tus credenciales para acceder a la plataforma."
      >
        <div className="space-y-5">
          {closedByInactivity ? (
            <Alert tone="info" title="Tu sesión se cerró por inactividad">
              Ingresa nuevamente para continuar de forma segura.
            </Alert>
          ) : null}
          <LoginForm />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
