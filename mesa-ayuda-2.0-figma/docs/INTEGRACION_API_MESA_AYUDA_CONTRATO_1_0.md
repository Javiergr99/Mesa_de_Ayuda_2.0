# Integración frontend · API Mesa de Ayuda · contrato 1.0

Esta implementación alinea el frontend con el contrato técnico/funcional recibido el 6 de agosto de 2026.

## Separación de servicios

- `auth_service`: `http://127.0.0.1:8000`
- Frontend Mesa de Ayuda: `http://127.0.0.1:5173`
- API Mesa de Ayuda: `http://127.0.0.1:8002`

En desarrollo, el frontend usa `/mesa-api` y el proxy de Vite lo dirige a `8002`. Esto evita depender de CORS mientras la API documentada todavía no lo configure.

Variables:

```env
VITE_MESA_AYUDA_API_URL=/mesa-api
VITE_MESA_AYUDA_API_PROXY_TARGET=http://127.0.0.1:8002
```

## Cliente HTTP

`src/shared/api/mesa-ayuda-api-client.ts` es el único punto de entrada HTTP para esta API.

Responsabilidades:

- agrega `Authorization: Bearer <access_token>`;
- no duplica lógica de tokens en páginas;
- ante `401`, intenta renovar la sesión por `auth_service` y reintenta una sola vez;
- centraliza errores `400/401/403/404/413/422/500`;
- admite JSON y `FormData`.

## Acciones exactas

La API no reconoce `SUPER_ADMIN` como bypass. Para las rutas de Mesa de Ayuda se evalúan acciones concretas:

- `VER_BITACORA`
- `CREAR_BITACORA`
- `ACTUALIZAR_BITACORA`
- `ELIMINAR_BITACORA`
- `SUBIR_ARCHIVO_BITACORA`
- `VER_DASHBOARD`

El frontend combina las acciones visibles en `/users/me` con el claim `acciones` del access token para decidir UX. La API sigue siendo la autoridad final.

## Endpoints conectados

### Bitácora

- `GET /api/v1/bitacoras/`
- `POST /api/v1/bitacoras/`
- `PATCH /api/v1/bitacoras/{id}`
- `DELETE /api/v1/bitacoras/{id}`

### Archivos

- `POST /api/v1/bitacoras/{id}/archivos`
- `GET /api/v1/bitacoras/{id}/archivos`
- `PUT /api/v1/bitacoras/{id}/archivos/{archivo_id}`

Reglas centralizadas:

- `.pdf`, `.docx`, `.xlsx`, `.csv`, `.msg`, `.eml`;
- máximo `20 MB` por archivo.

El nombre del campo multipart quedó aislado en el repositorio HTTP como `archivo`. Debe verificarse contra OpenAPI si el backend publica un nombre distinto.

### Dashboard

- `GET /api/v1/dashboard/resumen`
- `GET /api/v1/dashboard/serie-temporal`
- `GET /api/v1/dashboard/por-entidad`

El dashboard dejó de usar valores demo para indicadores principales y consume la API real.

## Catálogos

El contrato indica que todavía no hay endpoints públicos de catálogos. Por ello, estatus, tipos de caso y tipos de registro se concentran temporalmente en:

`src/features/attentions/model/attention.catalogs.ts`

No deben duplicarse en páginas, drawers o filtros. Cuando backend exponga catálogos, se sustituirá esta fuente central sin reescribir los componentes.

La relación numérica usada en esa fuente local refleja el orden documentado del seed y debe confirmarse contra `seed.py`/OpenAPI antes de una publicación formal.

## Funciones deliberadamente no simuladas

No se inventaron endpoints para:

- detalle individual `GET /api/v1/bitacoras/{id}`;
- descarga individual de adjuntos;
- eliminación individual de adjuntos;
- consulta de `audit_logs`;
- catálogos.

El drawer de detalle usa el objeto ya obtenido en el listado y consulta únicamente los archivos activos. El historial visual anterior se retiró del seguimiento porque no existe endpoint de auditoría.

## Organización

```text
Página / componente
  ↓
TanStack Query hook
  ↓
Service
  ↓
Repository
  ↓
mesaAyudaRequest
  ↓
API Mesa de Ayuda
```

Las páginas no realizan `fetch()` directo.

## Ejecución local

Backend:

```powershell
cd api_mesadeayuda
uv sync
uv run alembic upgrade head
uv run python seed.py
uv run uvicorn app.main:app --reload --port 8002
```

Frontend:

```powershell
cd mesa-ayuda-2.0-figma
npm run dev -- --port 5173 --force
```

El proxy de Vite enviará `/mesa-api/*` a `127.0.0.1:8002`.
