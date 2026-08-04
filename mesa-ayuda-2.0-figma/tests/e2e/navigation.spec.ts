import { expect, test } from "@playwright/test";

test("navega entre los módulos principales", async ({ page }) => {
  await page.goto("/app/dashboard");
  await expect(page.getByRole("heading", { name: "Panel de control" })).toBeVisible();
  await page.getByRole("link", { name: "Seguimiento" }).click();
  await expect(page.getByRole("heading", { name: "Seguimiento de atenciones" })).toBeVisible();
});
