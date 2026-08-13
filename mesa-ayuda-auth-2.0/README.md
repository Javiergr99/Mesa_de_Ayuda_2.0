# Mesa de Ayuda 2.0 — Portal de autenticación

Portal independiente para autenticación, MFA, sesión, perfil y selección de
accesos de Mesa de Ayuda 2.0.

## Estado actual

- Login por CURP y contraseña.
- Recuperación y creación inicial de contraseña.
- Configuración y verificación MFA/TOTP.
- Access token únicamente en memoria.
- Refresh token mediante cookie HttpOnly.
- Restauración de sesión tras F5.
- Cierre por inactividad de 60 minutos.
- Logout sincronizado entre pestañas.
- Usuario y permisos desde `GET /users/me`.
- Perfil de consulta.
- Accesos construidos desde grupos, módulos y acciones.
- SSO mediante `redirect-code` / `exchange-code`.
- Code splitting por rutas.
- Modo mock opcional.

## Seguridad de credenciales

```text
password       -> nunca persistida
TOTP           -> nunca persistido
temp_token MFA -> memoria
qr_uri/key     -> memoria
access_token   -> memoria
refresh_token  -> cookie HttpOnly
```

`sessionStorage`/`localStorage` solo pueden contener un marcador no sensible
para recordar la preferencia de duración de sesión.

Consulte [`docs/AUTENTICACION_Y_SEGURIDAD.md`](docs/AUTENTICACION_Y_SEGURIDAD.md).

## Backend real

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_ENABLE_MOCKS=false
```

```powershell
npm install
npm run dev
```

Frontend:

```text
http://127.0.0.1:5174
```

## Flujo

```text
POST /auth/login
    ↓
temp_token
    ├── setup MFA -> /auth/setup -> /auth/enable
    └── MFA existente -> /auth/login/2fa
    ↓
access token en memoria
refresh cookie HttpOnly
    ↓
GET /users/me
    ↓
/accesos
    ↓
redirect-code
```

## Calidad

Baseline validado el 13 de agosto de 2026:

- TypeScript: ✅
- Unit tests: **26/26**
- Build: ✅
- React Doctor: **100/100**
- Mayor chunk observado: **340.24 kB**
- E2E real: **1 passed**

```powershell
npm run typecheck
npm run test
npm run build
npx -y react-doctor@latest . --scope full --score --yes
```

E2E real:

```powershell
npm run test:e2e:real
```

Las credenciales de la cuenta E2E se suministran únicamente como variables de
entorno locales.

Documentación: [`docs/README.md`](docs/README.md).
