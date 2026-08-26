import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { DeferredRoute } from "@/app/router/deferred-route";
import { RootErrorBoundary } from "@/app/router/root-error-boundary";
import { AppShell } from "@/components/layout/app-shell";
import { ActionAccessGuard } from "@/features/auth/components/action-access-guard";
import { ProtectedAppRoute } from "@/features/auth/components/protected-app-route";
import { PlaceholderPage } from "@/features/placeholders/pages/placeholder-page";
import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";

const AttentionCreatePage = lazy(() =>
  import(
    "@/features/attention-create/pages/attention-create-page"
  ).then((module) => ({
    default: module.AttentionCreatePage,
  })),
);

const AttentionDetailPage = lazy(() =>
  import(
    "@/features/attentions/pages/attention-detail-page"
  ).then((module) => ({
    default: module.AttentionDetailPage,
  })),
);

const AttentionsPage = lazy(() =>
  import(
    "@/features/attentions/pages/attentions-page"
  ).then((module) => ({
    default: module.AttentionsPage,
  })),
);

const DashboardPage = lazy(() =>
  import(
    "@/features/dashboard/pages/dashboard-page"
  ).then((module) => ({
    default: module.DashboardPage,
  })),
);

const OrganizerPage = lazy(() =>
  import(
    "@/features/organizer/pages/organizer-page"
  ).then((module) => ({
    default: module.OrganizerPage,
  })),
);

const NotFoundPage = lazy(() =>
  import(
    "@/features/placeholders/pages/not-found-page"
  ).then((module) => ({
    default: module.NotFoundPage,
  })),
);

const ProfilePage = lazy(() =>
  import(
    "@/features/profile/pages/profile-page"
  ).then((module) => ({
    default: module.ProfilePage,
  })),
);

const TrackingPage = lazy(() =>
  import(
    "@/features/tracking/pages/tracking-page"
  ).then((module) => ({
    default: module.TrackingPage,
  })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "app",
        element: (
          <ProtectedAppRoute>
            <AppShell />
          </ProtectedAppRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <ActionAccessGuard
                action={MESA_AYUDA_ACTIONS.viewDashboard}
                exact
              >
                <DeferredRoute>
                  <DashboardPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "organizador",
            element: (
              <DeferredRoute>
                <OrganizerPage />
              </DeferredRoute>
            ),
          },
          {
            path: "atenciones",
            element: (
              <ActionAccessGuard
                action={MESA_AYUDA_ACTIONS.viewLog}
                exact
                moduleTitle="Atenciones"
                moduleDescription="Consulte, asigne y dé seguimiento a las atenciones registradas en Mesa de Ayuda."
              >
                <DeferredRoute>
                  <AttentionsPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "atenciones/nueva",
            element: (
              <ActionAccessGuard
                action={MESA_AYUDA_ACTIONS.createLog}
                exact
                moduleTitle="Registrar atención"
                moduleDescription="Capture una nueva atención en Mesa de Ayuda."
              >
                <DeferredRoute>
                  <AttentionCreatePage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "atenciones/:attentionId",
            element: (
              <ActionAccessGuard
                action={MESA_AYUDA_ACTIONS.viewLog}
                exact
                moduleTitle="Detalle de la atención"
                moduleDescription="Consulte la información registrada en modo de solo lectura."
              >
                <DeferredRoute>
                  <AttentionDetailPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "formato-nna",
            element: (
              <DeferredRoute>
                <AttentionCreatePage />
              </DeferredRoute>
            ),
          },
          {
            path: "seguimiento",
            element: (
              <ActionAccessGuard
                action={MESA_AYUDA_ACTIONS.viewLog}
                exact
                moduleTitle="Seguimiento de atenciones"
                moduleDescription="Consulte y actualice el seguimiento de las atenciones registradas."
              >
                <DeferredRoute>
                  <TrackingPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "perfil",
            element: (
              <DeferredRoute>
                <ProfilePage />
              </DeferredRoute>
            ),
          },
          {
            path: "mineria",
            element: (
              <PlaceholderPage
                title="Minería"
                description="Módulo pendiente de maquetación."
              />
            ),
          },
        ],
      },
      {
        path: "*",
        element: (
          <DeferredRoute>
            <NotFoundPage />
          </DeferredRoute>
        ),
      },
    ],
  },
]);
