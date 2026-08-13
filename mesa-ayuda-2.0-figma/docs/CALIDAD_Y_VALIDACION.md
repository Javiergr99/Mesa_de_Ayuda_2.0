# Calidad y validación

Baseline validado localmente el **13 de agosto de 2026**.

## Resultado

| Validación | Resultado |
|---|---|
| TypeScript | ✅ |
| Vitest | **14 archivos / 42 tests** |
| Build Vite | ✅ |
| React Doctor | **100/100 — No issues found** |
| Code splitting | ✅ |
| Mayor chunk observado | **469.44 kB / 148.35 kB gzip** |
| Warning de chunks >500 kB | eliminado |

El E2E real del portal Auth cubre además el ingreso cross-app a este frontend,
el intercambio de código, la restauración después de F5 y el logout.

## Validación mínima antes de integrar cambios

```powershell
npm run typecheck
npm run test
npm run build
npx -y react-doctor@latest . --scope full --score --yes
```

Para cambios estructurales también se recomienda:

```powershell
npm run lint
npm run validate:structure
```

## Regla

Los reportes JSON, fuentes temporales de diagnóstico, `dist/`, cobertura y
reportes Playwright son artefactos locales y no deben versionarse.
