import assert from "node:assert/strict";
import test from "node:test";

import { parseEnv, validateProductionUrl } from "../scripts/lib/production-env-validator.mjs";

test("acepta Auth, Login Access y API Mesa en 10.2.5.68", () => {
  for (const [name, value] of [
    ["VITE_API_URL", "http://10.2.5.68:8001"],
    ["VITE_AUTH_APP_URL", "http://10.2.5.68:5174/login"],
    ["VITE_MESA_AYUDA_API_URL", "http://10.2.5.68:8000"],
  ]) {
    assert.deepEqual(validateProductionUrl(name, value), []);
  }
});

test("rechaza localhost y 127.x.x.x", () => {
  assert.ok(validateProductionUrl("VITE_API_URL", "http://localhost:8001").length > 0);
  assert.ok(validateProductionUrl("VITE_API_URL", "http://127.0.0.1:8001").length > 0);
});

test("rechaza el proxy relativo /mesa-api como URL de producción", () => {
  assert.ok(validateProductionUrl("VITE_MESA_AYUDA_API_URL", "/mesa-api").length > 0);
});

test("rechaza trailing slash y credenciales embebidas", () => {
  assert.ok(validateProductionUrl("VITE_API_URL", "http://10.2.5.68:8001/").length > 0);
  assert.ok(
    validateProductionUrl("VITE_API_URL", "http://usuario:clave@10.2.5.68:8001").length > 0,
  );
});

test("permite Formato NNA público vacío mientras no esté desplegado", () => {
  assert.deepEqual(
    validateProductionUrl("VITE_FORMATO_NNA_PUBLIC_URL", "", {
      required: false,
    }),
    [],
  );
});

test("parseEnv conserva las URLs del servidor", () => {
  const env = parseEnv(`
VITE_API_URL=http://10.2.5.68:8001
VITE_AUTH_APP_URL=http://10.2.5.68:5174/login
VITE_MESA_AYUDA_API_URL=http://10.2.5.68:8000
  `);

  assert.equal(env.VITE_API_URL, "http://10.2.5.68:8001");
  assert.equal(env.VITE_AUTH_APP_URL, "http://10.2.5.68:5174/login");
  assert.equal(env.VITE_MESA_AYUDA_API_URL, "http://10.2.5.68:8000");
});
