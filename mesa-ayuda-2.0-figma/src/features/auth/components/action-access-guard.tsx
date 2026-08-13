import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { userHasAction } from "@/features/auth/model/auth.selectors";
import { sessionHasExactAction } from "@/features/auth/services/jwt-actions";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function ActionAccessGuard({
  action,
  exact = false,
  children,
}: {
  action: string;
  exact?: boolean;
  children: ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const allowed = exact
    ? sessionHasExactAction(user, action)
    : userHasAction(user, action);

  if (!allowed) {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-[var(--ui-text-primary)]">
          Acceso restringido
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--ui-text-secondary)]">
          Tu cuenta no tiene la acción {action} necesaria para consultar este módulo.
        </p>
      </Card>
    );
  }

  return children;
}
