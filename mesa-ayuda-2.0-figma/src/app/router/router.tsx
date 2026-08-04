import { createBrowserRouter, Navigate } from "react-router";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { OrganizerPage } from "@/features/organizer/pages/organizer-page";
import { AttentionsPage } from "@/features/attentions/pages/attentions-page";
import { AttentionCreatePage } from "@/features/attention-create/pages/attention-create-page";
import { TrackingPage } from "@/features/tracking/pages/tracking-page";
import { PlaceholderPage } from "@/features/placeholders/pages/placeholder-page";
import { NotFoundPage } from "@/features/placeholders/pages/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: "/app",
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", Component: DashboardPage },
      { path: "organizador", Component: OrganizerPage },
      { path: "atenciones", Component: AttentionsPage },
      { path: "atenciones/nueva", Component: AttentionCreatePage },
      { path: "seguimiento", Component: TrackingPage },
      {
        path: "mineria",
        element: <PlaceholderPage title="Minería" description="Módulo pendiente de maquetación." />,
      },
      {
        path: "usuarios",
        element: <PlaceholderPage title="Usuarios" description="Módulo pendiente de maquetación." />,
      },
      {
        path: "configuracion",
        element: <PlaceholderPage title="Configuración" description="Módulo pendiente de maquetación." />,
      },
    ],
  },
  { path: "*", Component: NotFoundPage },
]);
