import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AppSidebar } from "@/components/layout/app-sidebar";

describe("navegación responsive de Mesa de Ayuda", () => {
  it("conserva el filtrado por permisos en el drawer", () => {
    render(
      <MemoryRouter>
        <AppSidebar variant="drawer" permissions={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Organizador" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("notifica el cierre al navegar", () => {
    const onNavigate = vi.fn();

    render(
      <MemoryRouter>
        <AppSidebar variant="drawer" permissions={[]} onNavigate={onNavigate} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Organizador" }));

    expect(onNavigate).toHaveBeenCalledOnce();
  });
});
