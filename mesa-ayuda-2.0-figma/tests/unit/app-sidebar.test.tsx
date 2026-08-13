import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import { AppSidebar } from "@/components/layout/app-sidebar";

type RenderSidebarOptions = {
  initialPath?: string;
  expanded?: boolean;
  permissions?: string[];
  onNavigate?: () => void;
};

const ADMIN_PERMISSIONS = [
  "VER_DASHBOARD",
  "VER_BITACORA",
  "CREAR_BITACORA",
  "VER_USUARIOS",
  "CREAR_USUARIO",
  "ADMINISTRAR_USUARIOS",
];

function renderSidebar({
  initialPath = "/app/dashboard",
  expanded = false,
  permissions = ADMIN_PERMISSIONS,
  onNavigate,
}: RenderSidebarOptions = {}) {
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

function openUsersGroup() {
  const usersButton = screen.getByRole("button", {
    name: "Usuarios",
  });

  if (usersButton.getAttribute("aria-expanded") !== "true") {
    fireEvent.click(usersButton);
  }

  return usersButton;
}

describe("AppSidebar", () => {
  it("conserva accesibles las etiquetas aunque visualmente inicie contraído", () => {
    renderSidebar();

    expect(
      screen.getByRole("navigation", {
        name: "Módulos principales",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Historial administrativo",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Usuarios" }),
    ).toBeInTheDocument();
  });

  it("oculta las rutas administrativas cuando faltan permisos", () => {
    renderSidebar({ permissions: [] });

    expect(
      screen.queryByRole("button", { name: "Usuarios" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: "Configuración",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Atenciones" }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Organizador" }),
    ).toBeInTheDocument();
  });

  it("expone el estado expandido controlado por el shell sin usar ARIA inválido", () => {
    renderSidebar({
      initialPath: "/app/dashboard",
      expanded: true,
    });

    expect(
      screen.getByLabelText("Navegación lateral"),
    ).toHaveAttribute("data-expanded", "true");

    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).not.toHaveAttribute("title");
  });

  it("marca como activa la ruta actual de administración de usuarios", () => {
    renderSidebar({
      initialPath: "/app/usuarios",
      expanded: true,
    });

    const usersButton = openUsersGroup();

    expect(usersButton).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    expect(
      screen.getByRole("link", {
        name: "Administrar usuarios",
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("permite cerrar manualmente el grupo activo en la ruta actual", () => {
    renderSidebar({
      initialPath: "/app/usuarios",
      expanded: true,
    });

    const usersButton = screen.getByRole("button", {
      name: "Usuarios",
    });

    expect(usersButton).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    fireEvent.click(usersButton);

    expect(usersButton).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("solicita el cierre al seleccionar una opción de navegación", () => {
    const onNavigate = vi.fn();

    renderSidebar({
      expanded: true,
      onNavigate,
    });

    openUsersGroup();
    onNavigate.mockClear();

    fireEvent.click(
      screen.getByRole("link", {
        name: "Administrar usuarios",
      }),
    );

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("no cierra la barra al abrir una opción en otra pestaña", () => {
    const onNavigate = vi.fn();

    renderSidebar({
      expanded: true,
      onNavigate,
    });

    openUsersGroup();
    onNavigate.mockClear();

    const link = screen.getByRole("link", {
      name: "Administrar usuarios",
    });

    link.addEventListener(
      "click",
      (event) => event.preventDefault(),
      { once: true },
    );

    fireEvent.click(link, { ctrlKey: true });

    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("muestra iconos semánticos en los accesos de usuarios", () => {
    renderSidebar({
      expanded: true,
    });

    openUsersGroup();

    const manageUsersLink = screen.getByRole("link", {
      name: "Administrar usuarios",
    });

    const createUsersLink = screen.getByRole("link", {
      name: "Crear usuarios",
    });

    expect(
      manageUsersLink.querySelector(
        "svg.lucide-users-round",
      ),
    ).not.toBeNull();

    expect(
      createUsersLink.querySelector(
        "svg.lucide-user-plus",
      ),
    ).not.toBeNull();
  });
});
