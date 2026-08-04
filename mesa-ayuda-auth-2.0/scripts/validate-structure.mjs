import { access } from "node:fs/promises";
import { constants } from "node:fs";

const requiredPaths = [
  "src/app/providers/query-client.ts",
  "src/app/router/router.tsx",
  "src/app/styles/index.css",
  "src/components/layout/auth-layout.tsx",
  "src/components/layout/access-layout.tsx",
  "src/components/ui/button.tsx",
  "src/components/ui/otp-input.tsx",
  "src/features/auth/pages/login-page.tsx",
  "src/features/auth/pages/mfa-verify-page.tsx",
  "src/features/access/pages/access-page.tsx",
  "docs/ARQUITECTURA.md",
  "docs/AUTENTICACION_Y_SEGURIDAD.md",
];

const missing = [];
for (const path of requiredPaths) {
  try {
    await access(path, constants.F_OK);
  } catch {
    missing.push(path);
  }
}

if (missing.length > 0) {
  console.error("La estructura del proyecto está incompleta:");
  for (const path of missing) console.error(`- ${path}`);
  process.exit(1);
}

console.log(`Estructura validada: ${requiredPaths.length} archivos esenciales encontrados.`);
