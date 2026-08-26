import "./shared/navigation/scroll-reset";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import { router } from "@/app/router/router";
import { queryClient } from "@/app/providers/query-client";
import { AuthSessionProvider } from "@/features/auth/components/auth-session-provider";
import "@/app/styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se encontró el elemento raíz de la aplicación.");

createRoot(rootElement).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>
        <TooltipProvider delayDuration={250}>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
        </AuthSessionProvider>
      </QueryClientProvider>
</StrictMode>,
);
