import { expect, test } from "@playwright/test";

test("completa el flujo de autenticación simulado", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();

  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "Verifica tu identidad" })).toBeVisible();

  const code = "123456";
  for (const [index, digit] of [...code].entries()) {
    await page.getByLabel(`Dígito ${index + 1} de 6`).fill(digit);
  }

  await page.getByRole("button", { name: "Verificar identidad" }).click();
  await expect(page.getByRole("heading", { name: "Identidad verificada" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Accesos disponibles" })).toBeVisible({ timeout: 5_000 });
});
