import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login.schema";

describe("loginSchema", () => {
  it("acepta credenciales con correo válido", () => {
    const result = loginSchema.safeParse({
      identifier: "sofia.huerta@institucion.gob.mx",
      password: "MesaAyuda2026!",
      remember: false,
    });

    expect(result.success).toBe(true);
  });

  it("rechaza un correo con formato incorrecto", () => {
    const result = loginSchema.safeParse({ identifier: "correo-invalido", password: "123", remember: false });
    expect(result.success).toBe(false);
  });
});
