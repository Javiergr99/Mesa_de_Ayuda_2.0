import { render, screen } from "@testing-library/react";
import { Headphones } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { AccessCard } from "@/features/access/components/access-card";

const access = {
  id: "operations",
  title: "Operación de Atenciones",
  description: "Consulta y seguimiento de atenciones.",
  modules: ["Dashboard", "Atenciones"],
  permissions: ["Consultar"],
  level: "full" as const,
  tone: "blue" as const,
  icon: Headphones,
  destination: "http://127.0.0.1:5173/app/dashboard",
};

describe("AccessCard", () => {
  it("muestra el área, sus módulos y las acciones principales", () => {
    render(<AccessCard access={access} onViewPermissions={vi.fn()} />);
    expect(screen.getByText("Operación de Atenciones")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ver permisos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });
});
