# Mesa de Ayuda 2.0 — Frontend operativo

Aplicación operativa de Mesa de Ayuda 2.0 construida con React, TypeScript, Vite y una arquitectura organizada por funcionalidades.

## Módulos actuales

- Dashboard.
- Organizador.
- Atenciones.
- Registro de atención.
- Seguimiento.
- Perfil.
- Administración de usuarios.
- Configuración de apariencia e identidad.
- Minería como módulo pendiente.

Las páginas principales se cargan mediante code splitting por rutas con `React.lazy`.

## Autenticación

La aplicación no contiene un login propio. Recibe una sesión desde
`mesa-ayuda-auth-2.0` mediante `redirect-code` / `exchange-code`.

Modelo vigente:

```text
redirect-code de un solo uso
    ↓
POST /auth/exchange-code
    ↓
access_token -> memoria JavaScript
refresh_token -> cookie HttpOnly
    ↓
GET /users/me
```

Los JWT no se guardan en `localStorage` ni `sessionStorage`. Solo se persiste un
marcador no sensible que indica si la sesión se solicitó como normal o
persistente.

Variables principales:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_AUTH_APP_URL=http://127.0.0.1:5174/login
VITE_MESA_AYUDA_API_URL=/mesa-api
VITE_MESA_AYUDA_API_PROXY_TARGET=http://127.0.0.1:8002
```

Use `.env.example` como referencia para el resto de la configuración.

## Administración de usuarios

Rutas principales:

```text
/app/usuarios
/app/usuarios/nuevo
/app/usuarios/:userId/editar
/app/usuarios/historial
```

El módulo consume el contrato vigente de `auth_service`, mantiene la jerarquía
Grupo → Módulo → Acción y aplica las protecciones definidas para operaciones
administrativas sensibles.

Documentación:

- [`docs/MODULO_ADMINISTRACION_USUARIOS.md`](docs/MODULO_ADMINISTRACION_USUARIOS.md)
- [`docs/CONTRATO_ADMIN_AUTH_SERVICE_V1.md`](docs/CONTRATO_ADMIN_AUTH_SERVICE_V1.md)
- [`docs/roadmap/REQUERIMIENTOS_FUTUROS_ADMIN.md`](docs/roadmap/REQUERIMIENTOS_FUTUROS_ADMIN.md)

## API Mesa de Ayuda

La API operativa es independiente de `auth_service`.

En desarrollo:

```text
Frontend        http://127.0.0.1:5173
auth_service    http://127.0.0.1:8000
API operativa   http://127.0.0.1:8002
```

El prefijo local `/mesa-api` se redirige mediante Vite a la API operativa.
Consulte [`docs/INTEGRACION_API_MESA_AYUDA_CONTRATO_1_0.md`](docs/INTEGRACION_API_MESA_AYUDA_CONTRATO_1_0.md).

## Desarrollo

```powershell
npm install
npm run dev
```

## Calidad

Baseline validado el 13 de agosto de 2026:

- TypeScript: ✅
- Unit tests: **42/42**
- Build: ✅
- React Doctor: **100/100**
- Mayor chunk observado: **469.44 kB**
- Warning de chunks `>500 kB`: eliminado.

```powershell
npm run typecheck
npm run test
npm run build
npx -y react-doctor@latest . --scope full --score --yes
```

Documentación técnica: [`docs/README.md`](docs/README.md).
