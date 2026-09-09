import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AppSidebar } from "@/components/layout/app-sidebar";

function renderSidebar(props: Partial<ComponentProps<typeof AppSidebar>> = {}) {
  return render(
    <MemoryRouter initialEntries={["/app/organizador"]}>
      <AppSidebar {...props} />
    </MemoryRouter>,
  );
}

describe("AppSidebar fixed layout", () => {
  it("permanece fijo y conserva visible la etiqueta en escritorio", () => {
    renderSidebar();

    const sidebar = screen.getByRole("complementary", {
      name: "Navegación lateral",
    });

    expect(sidebar.className).toContain("fixed");
    expect(screen.getByRole("link", { name: "Organizador" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("no depende de hover o foco para conservar su ancho", () => {
    const onHoverChange = vi.fn();
    const onFocusWithinChange = vi.fn();

    renderSidebar({ onHoverChange, onFocusWithinChange });

    const sidebar = screen.getByRole("complementary", {
      name: "Navegación lateral",
    });

    fireEvent.mouseEnter(sidebar);
    fireEvent.focus(sidebar);
    fireEvent.mouseLeave(sidebar);

    expect(onHoverChange).not.toHaveBeenCalled();
    expect(onFocusWithinChange).not.toHaveBeenCalled();
  });
});
