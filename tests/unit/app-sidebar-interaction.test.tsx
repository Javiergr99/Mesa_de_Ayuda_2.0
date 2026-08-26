import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import { AppSidebar } from "@/components/layout/app-sidebar";

function renderSidebar(
  props: Partial<ComponentProps<typeof AppSidebar>> = {},
) {
  return render(
    <MemoryRouter initialEntries={["/app/organizador"]}>
      <AppSidebar expanded {...props} />
    </MemoryRouter>,
  );
}

describe("AppSidebar interactions", () => {
  it("no deja el sidebar fijado por el foco generado con el puntero", () => {
    const onHoverChange = vi.fn();
    const onFocusWithinChange = vi.fn();

    renderSidebar({
      onHoverChange,
      onFocusWithinChange,
    });

    const sidebar = screen.getByRole("complementary", {
      name: "Navegación lateral",
    });
    const link = screen.getByRole("link", {
      name: "Organizador",
    });

    fireEvent.mouseEnter(sidebar);
    fireEvent.pointerDown(link);
    fireEvent.focus(link);
    fireEvent.mouseLeave(sidebar);

    expect(onHoverChange).toHaveBeenLastCalledWith(false);
    expect(onFocusWithinChange).toHaveBeenLastCalledWith(false);
  });

  it("mantiene la expansion cuando la interaccion proviene del teclado", () => {
    const onFocusWithinChange = vi.fn();

    renderSidebar({
      onFocusWithinChange,
    });

    const sidebar = screen.getByRole("complementary", {
      name: "Navegación lateral",
    });
    const link = screen.getByRole("link", {
      name: "Organizador",
    });

    fireEvent.keyDown(sidebar, { key: "Tab" });
    fireEvent.focus(link);

    expect(onFocusWithinChange).toHaveBeenLastCalledWith(true);

    fireEvent.blur(link, { relatedTarget: document.body });

    expect(onFocusWithinChange).toHaveBeenLastCalledWith(false);
  });
});
