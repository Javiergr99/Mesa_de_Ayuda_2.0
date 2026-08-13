import { describe, expect, it } from "vitest";

import {
  cleanExchangeNavigationParameters,
  readExchangeNavigationRequest,
} from "@/features/auth/services/exchange-navigation";

describe("exchange navigation", () => {
  it.each([
    "/app/dashboard",
    "/app/formato-nna",
    "/app/usuarios",
  ])("acepta el código en la entrada autorizada %s", (pathname) => {
    const request = readExchangeNavigationRequest(
      new URL(
        `http://127.0.0.1:5173${pathname}?code=one-use&persistence=persistent`,
      ),
    );

    expect(request).toEqual({
      code: "one-use",
      persistence: "persistent",
    });
  });

  it("rechaza el intercambio desde una ruta distinta", () => {
    expect(() =>
      readExchangeNavigationRequest(
        new URL("http://127.0.0.1:5173/app/perfil?code=one-use"),
      ),
    ).toThrow(/ruta de entrada autorizada/i);
  });

  it("rechaza parámetros adicionales y fragmentos", () => {
    expect(() =>
      readExchangeNavigationRequest(
        new URL(
          "http://127.0.0.1:5173/app/dashboard?code=one-use&next=/app/perfil",
        ),
      ),
    ).toThrow(/parámetros/i);

    expect(() =>
      readExchangeNavigationRequest(
        new URL(
          "http://127.0.0.1:5173/app/dashboard?code=one-use#detalle",
        ),
      ),
    ).toThrow(/fragmentos/i);
  });

  it("limpia el código y la preferencia de sesión de la barra de direcciones", () => {
    expect(
      cleanExchangeNavigationParameters(
        new URL(
          "http://127.0.0.1:5173/app/dashboard?code=one-use&persistence=session",
        ),
      ),
    ).toBe("http://127.0.0.1:5173/app/dashboard");
  });
});
