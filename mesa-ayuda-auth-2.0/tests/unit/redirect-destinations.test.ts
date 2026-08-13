import { describe, expect, it } from "vitest";

import {
  getConfiguredRedirectDestinations,
  resolveConfiguredRedirectDestination,
} from "@/shared/config/redirect-destinations";

describe("redirect destinations", () => {
  it("expone las tres URLs exactas acordadas con auth_service", () => {
    expect(getConfiguredRedirectDestinations()).toEqual([
      "http://127.0.0.1:5173/app/dashboard",
      "http://127.0.0.1:5173/app/formato-nna",
      "http://127.0.0.1:5173/app/usuarios",
    ]);
  });

  it("rechaza destinos que no pertenezcan al registro configurado", () => {
    expect(() =>
      resolveConfiguredRedirectDestination(
        "http://127.0.0.1:5173/app/perfil",
      ),
    ).toThrow(/ninguna URL configurada/i);
  });
});
