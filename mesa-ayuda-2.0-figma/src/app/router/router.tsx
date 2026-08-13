import {
  lazy,
  Suspense,
  type ReactNode,
} from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { RootErrorBoundary } from "@/app/router/root-error-boundary";
import { AppShell } from "@/components/layout/app-shell";
import { AppearanceAccessGuard } from "@/features/appearance-settings/components/appearance-access-guard";
import { ActionAccessGuard } from "@/features/auth/components/action-access-guard";
import { ProtectedAppRoute } from "@/features/auth/components/protected-app-route";
import { PlaceholderPage } from "@/features/placeholders/pages/placeholder-page";
import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";

const AppearanceSettingsPage = lazy(() =>
  import(
    "@/features/appearance-settings/pages/appearance-settings-page"
  ).then((module) => ({
    default: module.AppearanceSettingsPage,
  })),
);

const AttentionCreatePage = lazy(() =>
  import(
    "@/features/attention-create/pages/attention-create-page"
  ).then((module) => ({
    default: module.AttentionCreatePage,
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

const AdminHistoryPage = lazy(() =>
  import(
    "@/features/system-administration/pages/admin-history-page"
  ).then((module) => ({
    default: module.AdminHistoryPage,
  })),
);

const AdminUserCreatePage = lazy(() =>
  import(
    "@/features/system-administration/pages/admin-user-create-page"
  ).then((module) => ({
    default: module.AdminUserCreatePage,
  })),
);

const AdminUserEditPage = lazy(() =>
  import(
    "@/features/system-administration/pages/admin-user-edit-page"
  ).then((module) => ({
    default: module.AdminUserEditPage,
  })),
);

const AdminUsersListPage = lazy(() =>
  import(
    "@/features/system-administration/pages/admin-users-list-page"
  ).then((module) => ({
    default: module.AdminUsersListPage,
  })),
);

const TrackingPage = lazy(() =>
  import(
    "@/features/tracking/pages/tracking-page"
  ).then((module) => ({
    default: module.TrackingPage,
  })),
);

function RouteChunkFallback() {
  return (
    <div
      className="grid min-h-[42vh] place-items-center px-6"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <span
          className="mx-auto block h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--ui-border)] border-t-[var(--ui-primary)]"
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-medium text-[var(--ui-text-secondary)]">
          Cargando módulo…
        </p>
      </div>
    </div>
  );
}

function DeferredRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<RouteChunkFallback />}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      {
        path: "app",
        element: (
          <ProtectedAppRoute>
            <AppShell />
          </ProtectedAppRoute>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
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
              >
                <DeferredRoute>
                  <AttentionCreatePage />
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
          {
            path: "usuarios",
            element: (
              <ActionAccessGuard action="VER_USUARIOS">
                <DeferredRoute>
                  <AdminUsersListPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "usuarios/nuevo",
            element: (
              <ActionAccessGuard action="CREAR_USUARIO">
                <DeferredRoute>
                  <AdminUserCreatePage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "usuarios/:userId/editar",
            element: (
              <ActionAccessGuard action="ACTUALIZAR_USUARIO">
                <DeferredRoute>
                  <AdminUserEditPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "usuarios/historial",
            element: (
              <ActionAccessGuard action="VER_USUARIOS">
                <DeferredRoute>
                  <AdminHistoryPage />
                </DeferredRoute>
              </ActionAccessGuard>
            ),
          },
          {
            path: "configuracion",
            element: <Navigate to="apariencia" replace />,
          },
          {
            path: "configuracion/apariencia",
            element: (
              <AppearanceAccessGuard>
                <DeferredRoute>
                  <AppearanceSettingsPage />
                </DeferredRoute>
              </AppearanceAccessGuard>
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
