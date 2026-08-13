# Calidad, seguridad y validación

Baseline validado localmente el **13 de agosto de 2026**.

## Resultado

| Validación | Resultado |
|---|---|
| TypeScript | ✅ |
| Vitest | **11 archivos / 26 tests** |
| Build Vite | ✅ |
| React Doctor | **100/100 — No issues found** |
| Code splitting | ✅ |
| Mayor chunk observado | **340.24 kB / 107.63 kB gzip** |
| Warning de chunks >500 kB | eliminado |
| Playwright E2E real | **1 passed** |

## E2E real

La prueba cubre:

1. disponibilidad de `auth_service`;
2. login real;
3. desafío MFA sin persistencia del `temp_token`;
4. TOTP real;
5. refresh cookie `HttpOnly`;
6. ausencia de JWT en Web Storage;
7. acceso autorizado;
8. `redirect-code`;
9. `exchange-code`;
10. entrada en Mesa de Ayuda;
11. F5 y restauración de sesión;
12. logout;
13. eliminación de cookie y revocación cross-app.

## Validación mínima

```powershell
npm run typecheck
npm run test
npm run build
npx -y react-doctor@latest . --scope full --score --yes
```

Para autenticación/SSO:

```powershell
npm run test:e2e:real
```

Las credenciales y el secreto TOTP de la cuenta de pruebas se suministran como
variables de entorno locales y nunca se versionan.

Los reportes de Playwright/React Doctor son artefactos temporales.
