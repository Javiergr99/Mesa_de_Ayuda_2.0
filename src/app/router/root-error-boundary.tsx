import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorPresentation = {
  title: string;
  description: string;
};

function getErrorPresentation(error: unknown): ErrorPresentation {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: "Página no disponible",
        description:
          "La sección solicitada no existe o ya no se encuentra disponible.",
      };
    }

    if (error.status === 403) {
      return {
        title: "Acceso no disponible",
        description:
          "No fue posible mostrar esta sección con los permisos actuales.",
      };
    }

    return {
      title: "No fue posible cargar esta sección",
      description:
        "Ocurrió un problema al procesar la solicitud. Puedes volver al inicio o intentarlo nuevamente.",
    };
  }

  return {
    title: "Ocurrió un error inesperado",
    description:
      "Mesa de Ayuda no pudo mostrar esta pantalla correctamente. Puedes volver al inicio o recargar la aplicación.",
  };
}

/**
 * Límite de error global para las rutas de Mesa de Ayuda 2.0.
 *
 * Evita que un error de renderizado o de navegación deje al usuario frente a
 * la interfaz genérica de React Router. No expone mensajes técnicos ni trazas.
 */
export function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const presentation = getErrorPresentation(error);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--ui-canvas)] px-4 py-10">
      <Card className="w-full max-w-[560px] p-6 text-center sm:p-8">
        <span
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50 text-amber-600"
          aria-hidden="true"
        >
          <AlertTriangle className="h-7 w-7" strokeWidth={1.9} />
        </span>

        <h1 className="mt-5 text-xl font-bold tracking-tight text-[var(--ui-text-primary)]">
          {presentation.title}
        </h1>

        <p className="mx-auto mt-2 max-w-[440px] text-sm leading-6 text-[var(--ui-text-secondary)]">
          {presentation.description}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Intentar nuevamente
          </Button>

          <Button
            onClick={() => {
              void navigate("/app/dashboard", { replace: true });
            }}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Button>
        </div>
      </Card>
    </main>
  );
}
