import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "@/features/auth/model/auth.store";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <Navigate to="/accesos" replace /> : children;
}

export function PendingMfaRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const tempToken = useAuthStore((state) => state.tempToken);

  if (user) return <Navigate to="/accesos" replace />;
  if (!tempToken) return <Navigate to="/login" replace />;
  return children;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
}
