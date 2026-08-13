<a id="top"></a>

<div align="center">
  <img
    src="./docs/assets/mesa-ayuda-banner.svg"
    alt="Mesa de Ayuda 2.0 â€” autenticaciÃ³n segura, gestiÃ³n centralizada y seguimiento trazable"
    width="100%"
  />

  <br />

  <p>
    <strong>Plataforma web modular para autenticaciÃ³n centralizada, gestiÃ³n de accesos y operaciÃ³n de Mesa de Ayuda.</strong>
  </p>

  <p>
    Dos frontends independientes, una sesiÃ³n segura compartida mediante auth_service y una aplicaciÃ³n operativa desacoplada de la autenticaciÃ³n.
  </p>

  <p>
    <a href="./mesa-ayuda-auth-2.0"><strong>Portal de autenticaciÃ³n</strong></a>
    Â·
    <a href="./mesa-ayuda-2.0-figma"><strong>AplicaciÃ³n operativa</strong></a>
    Â·
    <a href="#-inicio-rÃ¡pido"><strong>Inicio rÃ¡pido</strong></a>
    Â·
    <a href="#-arquitectura"><strong>Arquitectura</strong></a>
    Â·
    <a href="#-calidad-y-pruebas"><strong>Calidad</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/estado-en%20desarrollo-F59E0B?style=for-the-badge" alt="Estado: en desarrollo" />
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A" alt="React 19.2" />
    <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  </p>
</div>

---

## âœ¨ DescripciÃ³n

**Mesa de Ayuda 2.0** moderniza el registro, la organizaciÃ³n, el seguimiento y la administraciÃ³n de accesos mediante una arquitectura frontend separada por responsabilidades.

| AplicaciÃ³n | Carpeta | Puerto local | Responsabilidad |
|---|---|---:|---|
| **Portal de autenticaciÃ³n** | [`mesa-ayuda-auth-2.0`](./mesa-ayuda-auth-2.0) | `5174` | Login, recuperaciÃ³n, creaciÃ³n inicial de contraseÃ±a, MFA, sesiÃ³n, perfil y accesos disponibles. |
| **AplicaciÃ³n operativa** | [`mesa-ayuda-2.0-figma`](./mesa-ayuda-2.0-figma) | `5173` | Dashboard, organizador, atenciones, seguimiento, perfil, administraciÃ³n de usuarios y configuraciÃ³n visual. |

La autenticaciÃ³n y la operaciÃ³n se despliegan y prueban de manera independiente. `auth_service` conserva la autoridad de autenticaciÃ³n y autorizaciÃ³n; la API de Mesa de Ayuda atiende el dominio operativo.

> [!IMPORTANT]
> La sesiÃ³n vigente **no almacena JWT en Web Storage**. El access token vive Ãºnicamente en memoria JavaScript y el refresh token permanece en una cookie `HttpOnly` administrada por `auth_service`. `sessionStorage/localStorage` solo conservan un marcador no sensible de preferencia de persistencia.

---

## ðŸ–¼ï¸ Vista previa

<table>
  <tr>
    <td align="center"><strong>Inicio de sesiÃ³n institucional</strong></td>
    <td align="center"><strong>Accesos disponibles</strong></td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./docs/assets/login.png" alt="Pantalla de inicio de sesiÃ³n de Mesa de Ayuda 2.0" />
    </td>
    <td width="50%">
      <img src="./docs/assets/accesos-disponibles.png" alt="Pantalla de accesos disponibles de Mesa de Ayuda 2.0" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Seguimiento de atenciones</strong></td>
    <td align="center"><strong>Registro de una nueva atenciÃ³n</strong></td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./docs/assets/seguimiento.png" alt="Pantalla de seguimiento de atenciones" />
    </td>
    <td width="50%">
      <img src="./docs/assets/registrar-atencion.png" alt="Formulario para registrar una nueva atenciÃ³n" />
    </td>
  </tr>
</table>

> Los nombres y datos visibles en las capturas son demostrativos.

---

## ðŸš€ Capacidades principales

### Portal de autenticaciÃ³n

- Login mediante CURP y contraseÃ±a.
- CreaciÃ³n inicial y recuperaciÃ³n de contraseÃ±a.
- ConfiguraciÃ³n y verificaciÃ³n MFA/TOTP.
- `temp_token`, `qr_uri` y `manual_key` Ãºnicamente en memoria.
- Access token Ãºnicamente en memoria.
- Refresh token mediante cookie `HttpOnly`.
- RenovaciÃ³n de sesiÃ³n y restauraciÃ³n despuÃ©s de recargar la pÃ¡gina.
- Cierre automÃ¡tico por 60 minutos de inactividad.
- SincronizaciÃ³n de logout entre pestaÃ±as.
- Perfil de consulta.
- Accesos disponibles construidos desde grupos, mÃ³dulos y acciones.
- Puente SSO mediante `redirect-code` / `exchange-code`.
- Modo mock opcional para desarrollo.

### AplicaciÃ³n operativa

- Dashboard con integraciÃ³n a la API operativa.
- Organizador.
- Listado y registro de atenciones.
- Adjuntos y validaciones de formulario.
- Seguimiento, filtros, paginaciÃ³n y drawer de detalle.
- Perfil autenticado.
- AdministraciÃ³n de usuarios y permisos.
- ConfiguraciÃ³n local de apariencia e identidad.
- Guards de autorizaciÃ³n por acciÃ³n.
- IntegraciÃ³n con Login Universal.
- Code splitting por rutas con `React.lazy`.

---

## ðŸ§° TecnologÃ­as

| Ãrea | TecnologÃ­as |
|---|---|
| **Frontend** | React 19, React DOM, TypeScript 6 y Vite 8. |
| **Estilos** | Tailwind CSS 4, Design Tokens, variables CSS y CVA. |
| **NavegaciÃ³n** | React Router 8. |
| **Datos remotos** | TanStack Query; Axios en Auth y clientes HTTP tipados en la aplicaciÃ³n operativa. |
| **Formularios** | React Hook Form y Zod. |
| **Estado cliente** | Zustand. |
| **UI** | Radix UI, Lucide React, Font Awesome y `qrcode.react`. |
| **InteracciÃ³n** | Motion y Sonner. |
| **Pruebas** | Vitest, Testing Library y Playwright. |
| **Calidad** | TypeScript, ESLint, Prettier y React Doctor. |

---

## ðŸ—ï¸ Arquitectura

```mermaid
flowchart LR
    U[Usuario] --> AUTH[Portal Auth :5174]
    AUTH --> LOGIN[Login + MFA]
    LOGIN --> AS[(auth_service :8000)]

    AS -->|access token JSON| AUTH
    AS -->|refresh cookie HttpOnly| AUTH

    AUTH --> ACCESS[Accesos disponibles]
    ACCESS -->|redirect-code| APP[Mesa de Ayuda :5173]
    APP -->|exchange-code| AS
    AS -->|access token + refresh cookie| APP

    APP --> CORE[(API Mesa de Ayuda :8002)]

    AUTH -. access token en memoria .-> AS
    APP -. Bearer en APIs protegidas .-> AS
    APP -. Bearer .-> CORE
```

### Modelo de sesiÃ³n

```text
Credenciales
    â†“
temp_token MFA (memoria)
    â†“
TOTP
    â†“
access_token (memoria)
refresh_token (cookie HttpOnly)
    â†“
GET /users/me
    â†“
redirect-code de un solo uso
    â†“
exchange-code en la aplicaciÃ³n destino
```

Los JWT nunca se incorporan a la URL ni se escriben en `localStorage` o `sessionStorage`.

### OrganizaciÃ³n

```text
Mesa_de_Ayuda_2.0/
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â””â”€â”€ react-doctor.yml
â”œâ”€â”€ docs/
â”œâ”€â”€ mesa-ayuda-auth-2.0/
â”‚   â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ src/
â”‚   â””â”€â”€ tests/
â””â”€â”€ mesa-ayuda-2.0-figma/
    â”œâ”€â”€ docs/
    â”œâ”€â”€ scripts/
    â”œâ”€â”€ src/
    â””â”€â”€ tests/
```

Cada frontend organiza su dominio mediante `app`, `components`, `features`, `shared` y `tests`.

---

## ðŸŽ¨ Sistema de diseÃ±o

Ambos frontends utilizan tokens semÃ¡nticos y componentes reutilizables. El portal Auth separa sus tokens principales en:

```text
src/app/styles/
â”œâ”€â”€ tokens.css
â”œâ”€â”€ themes.css
â”œâ”€â”€ typography.css
â””â”€â”€ index.css
```

La aplicaciÃ³n operativa mantiene sus tokens institucionales y el mÃ³dulo de configuraciÃ³n visual sin mezclar reglas de negocio con valores de presentaciÃ³n.

---

## âš¡ Inicio rÃ¡pido

### Requisitos

- Node.js `22.22` o superior.
- npm `10.9` o superior.
- Los servicios backend necesarios para flujos reales.

### InstalaciÃ³n

```powershell
git clone https://github.com/Javiergr99/Mesa_de_Ayuda_2.0.git
cd Mesa_de_Ayuda_2.0

cd .\mesa-ayuda-auth-2.0
npm install

cd ..\mesa-ayuda-2.0-figma
npm install
```

Configure cada frontend a partir de su `.env.example`. No mezcle `localhost` y `127.0.0.1` dentro del mismo flujo de autenticaciÃ³n/cookies.

### EjecuciÃ³n

**Auth:**

```powershell
cd .\mesa-ayuda-auth-2.0
npm run dev
```

**AplicaciÃ³n operativa:**

```powershell
cd .\mesa-ayuda-2.0-figma
npm run dev
```

| Servicio | DirecciÃ³n local |
|---|---|
| Auth frontend | `http://127.0.0.1:5174` |
| Mesa de Ayuda frontend | `http://127.0.0.1:5173` |
| `auth_service` | `http://127.0.0.1:8000` |
| API Mesa de Ayuda | `http://127.0.0.1:8002` |

---

## âš™ï¸ ConfiguraciÃ³n de entorno

### Auth

Variables principales:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_ENABLE_MOCKS=false
VITE_MESA_AYUDA_URL=http://127.0.0.1:5173/app/dashboard
VITE_FORMATO_NNA_URL=http://127.0.0.1:5173/app/formato-nna
VITE_ADMIN_URL=http://127.0.0.1:5173/app/usuarios
```

### AplicaciÃ³n operativa

Variables principales:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_AUTH_APP_URL=http://127.0.0.1:5174/login
VITE_MESA_AYUDA_API_URL=/mesa-api
VITE_MESA_AYUDA_API_PROXY_TARGET=http://127.0.0.1:8002
```

Los `.env.example` de cada proyecto son la referencia para variables adicionales.

> [!CAUTION]
> Nunca versionar contraseÃ±as, secretos TOTP, JWT, cookies, claves privadas ni archivos `.env` reales.

---

## ðŸ§­ Rutas principales

### Auth

| Ruta | Uso |
|---|---|
| `/login` | Inicio de sesiÃ³n. |
| `/recuperar-acceso` | RecuperaciÃ³n de acceso. |
| `/restablecer-contrasena?token=...` | Restablecimiento. |
| `/crear-password?token=...` | CreaciÃ³n inicial de contraseÃ±a. |
| `/crear-contrasena?token=...` | Alias temporal compatible. |
| `/mfa/configurar` | ConfiguraciÃ³n inicial de MFA. |
| `/mfa/verificar` | VerificaciÃ³n recurrente. |
| `/acceso-correcto` | TransiciÃ³n posterior a MFA. |
| `/accesos` | Aplicaciones autorizadas. |
| `/perfil` | Perfil de consulta. |
| `/cerrar-sesion` | Puente de logout. |

### AplicaciÃ³n operativa

| Ruta | Uso |
|---|---|
| `/app/dashboard` | Dashboard. |
| `/app/organizador` | Organizador. |
| `/app/atenciones` | Listado de atenciones. |
| `/app/atenciones/nueva` | Registro de atenciÃ³n. |
| `/app/formato-nna` | Entrada autorizada que reutiliza el formulario. |
| `/app/seguimiento` | Seguimiento. |
| `/app/perfil` | Perfil. |
| `/app/usuarios` | AdministraciÃ³n de usuarios. |
| `/app/usuarios/nuevo` | Alta de usuario. |
| `/app/usuarios/:userId/editar` | EdiciÃ³n. |
| `/app/configuracion/apariencia` | ConfiguraciÃ³n visual. |
| `/app/mineria` | MÃ³dulo pendiente. |

---

## âœ… Calidad y pruebas

Baseline validado el **13 de agosto de 2026**:

| ValidaciÃ³n | Operativo | Auth |
|---|---:|---:|
| TypeScript | âœ… | âœ… |
| Unit tests | **42/42** | **26/26** |
| Build Vite | âœ… | âœ… |
| React Doctor | **100/100** | **100/100** |
| Chunk principal mÃ¡ximo observado | **469.44 kB** | **340.24 kB** |
| Warning `>500 kB` | eliminado | eliminado |
| E2E real Auth â†’ Mesa â†’ F5 â†’ logout | cubierto por la suite cross-app | **1 passed** |

Comandos habituales:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run doctor
```

Auth dispone ademÃ¡s de:

```powershell
npm run test:e2e:real
```

El E2E real usa una cuenta dedicada de pruebas y secretos suministrados exclusivamente mediante variables de entorno locales.

---

## ðŸ” Seguridad

- Bearer continÃºa siendo el mecanismo de autorizaciÃ³n de las APIs protegidas.
- El **access token vive exclusivamente en memoria**.
- El **refresh token vive exclusivamente en cookie `HttpOnly`**.
- La preferencia â€œmantener sesiÃ³nâ€ se conserva como un marcador no sensible; no almacena JWT.
- El `temp_token` del desafÃ­o MFA vive Ãºnicamente en memoria.
- `qr_uri`, `manual_key`, cÃ³digos TOTP y contraseÃ±as no se persisten.
- El refresh rota en backend y se utiliza para restaurar una sesiÃ³n despuÃ©s de F5.
- El logout remoto elimina/revoca la sesiÃ³n y la aplicaciÃ³n limpia su estado aunque el request de cierre falle.
- `BroadcastChannel` sincroniza cierres entre pestaÃ±as.
- Las sesiones autenticadas se cierran tras 60 minutos de inactividad.
- El frontend oculta acciones no autorizadas, pero el backend conserva la autoridad final.

---

## ðŸ—ºï¸ Hoja de ruta

### Completado

- [x] Frontends independientes para Auth y operaciÃ³n.
- [x] Login, recuperaciÃ³n y creaciÃ³n inicial de contraseÃ±a.
- [x] MFA/TOTP.
- [x] Refresh mediante cookie HttpOnly.
- [x] SSO `redirect-code` / `exchange-code`.
- [x] RestauraciÃ³n de sesiÃ³n tras F5.
- [x] Dashboard y API operativa.
- [x] Atenciones y seguimiento.
- [x] AdministraciÃ³n de usuarios y permisos.
- [x] Perfil en ambos frontends.
- [x] ConfiguraciÃ³n visual local.
- [x] Code splitting por rutas.
- [x] React Doctor 100/100 en ambos frontends.
- [x] E2E real de autenticaciÃ³n, SSO, refresh y logout.
- [x] IntegraciÃ³n de React Doctor en CI.

### Pendiente / evolutivo

- [ ] Implementar MinerÃ­a.
- [ ] Persistencia institucional/global de apariencia cuando exista contrato backend.
- [ ] Capacidades administrativas que todavÃ­a no publique `auth_service` (auditorÃ­a, operaciones especializadas, etc.).
- [ ] Preparar despliegue por ambientes y observabilidad.
- [ ] AuditorÃ­as dedicadas de accesibilidad y rendimiento de experiencia real (Lighthouse/Web Vitals).

---

## ðŸ¤ ColaboraciÃ³n

Antes de integrar cambios:

1. Mantenga el cambio dentro del mÃ³dulo correspondiente.
2. Actualice pruebas cuando cambie comportamiento.
3. No debilite contratos de autenticaciÃ³n o permisos para resolver problemas visuales.
4. Ejecute typecheck, tests, build y React Doctor.
5. Para cambios de autenticaciÃ³n/SSO, ejecute tambiÃ©n el E2E real.

---

## ðŸŽ¯ DiseÃ±o

Referencia principal de Figma:

**Mesa de Ayuda 2.0**
`QajWuVBDoFpZ4bSQqI4ZML`

---

## ðŸ‘¨â€ðŸ’» Autor

<div align="center">
  <strong>Javier Garcia</strong><br />
  Programador Jr Â· DiseÃ±o y desarrollo frontend
</div>

<div align="center">
  <br />
  <a href="#top"><strong>Volver al inicio â†‘</strong></a>
</div>
