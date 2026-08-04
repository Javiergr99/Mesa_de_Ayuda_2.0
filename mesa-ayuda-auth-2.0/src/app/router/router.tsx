import { createBrowserRouter, Navigate } from "react-router";

import { PendingMfaRoute, ProtectedRoute, PublicOnlyRoute } from "@/app/router/route-guards";
import { AccessPage } from "@/features/access/pages/access-page";
import { AuthSuccessPage } from "@/features/auth/pages/auth-success-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import { MfaSetupPage } from "@/features/auth/pages/mfa-setup-page";
import { MfaVerifyPage } from "@/features/auth/pages/mfa-verify-page";
import { NotFoundPage } from "@/features/auth/pages/not-found-page";
import { RecoverAccessPage } from "@/features/auth/pages/recover-access-page";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
  { path: "/recuperar-acceso", element: <PublicOnlyRoute><RecoverAccessPage /></PublicOnlyRoute> },
  { path: "/mfa/verificar", element: <PendingMfaRoute><MfaVerifyPage /></PendingMfaRoute> },
  { path: "/mfa/configurar", element: <PendingMfaRoute><MfaSetupPage /></PendingMfaRoute> },
  { path: "/acceso-correcto", element: <ProtectedRoute><AuthSuccessPage /></ProtectedRoute> },
  { path: "/accesos", element: <ProtectedRoute><AccessPage /></ProtectedRoute> },
  { path: "*", Component: NotFoundPage },
]);
