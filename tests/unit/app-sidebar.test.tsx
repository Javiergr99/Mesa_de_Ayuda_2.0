import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";

const permissions = [
  MESA_AYUDA_ACTIONS.viewDashboard,
  MESA_AYUDA_ACTIONS.viewLog,
  MESA_AYUDA_ACTIONS.createLog,
];

function renderSidebar({
  initialPath = "/app/dashboard",
  expanded = true,
  onNavigate,
}: {
  initialPath?: string;
  expanded?: boolean;
  onNavigate?: () => void;
} = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppSidebar
        expanded={expanded}
        permissions={permissions}
        onNavigate={onNavigate}
      />
    </MemoryRouter>,
  );
}

describe("AppSidebar", () => {
  it("mantiene accesibles las rutas operativas de Mesa de Ayuda", () => {
    renderSidebar({ expanded: false });

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Atenciones" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registrar Atención" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Seguimiento" })).toBeInTheDocument();
  });

  it("ya no expone administración ni configuración dentro de Mesa de Ayuda", () => {
    renderSidebar();

    expect(screen.queryByText("Usuarios")).not.toBeInTheDocument();
    expect(screen.queryByText("Historial administrativo")).not.toBeInTheDocument();
    expect(screen.queryByText("Configuración")).not.toBeInTheDocument();
  });

  it("marca como activa una ruta operativa", () => {
    renderSidebar({ initialPath: "/app/atenciones" });

    expect(screen.getByRole("link", { name: "Atenciones" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("solicita cerrar la barra al navegar con clic primario", () => {
    const onNavigate = vi.fn();
    renderSidebar({ onNavigate });

    fireEvent.click(screen.getByRole("link", { name: "Atenciones" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("no solicita cerrar la barra al abrir en otra pestaña", () => {
    const onNavigate = vi.fn();
    renderSidebar({ onNavigate });

    fireEvent.click(screen.getByRole("link", { name: "Atenciones" }), {
      ctrlKey: true,
    });
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
