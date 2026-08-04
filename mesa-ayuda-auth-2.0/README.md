# Mesa de Ayuda 2.0 — Autenticación y Accesos

Frontend independiente para el inicio de sesión, la autenticación de dos factores y la selección de accesos disponibles de **Mesa de Ayuda 2.0**.

Referencia de diseño: archivo Figma **Mesa de Ayuda 2.0**, incluyendo los estados de login, MFA y tarjetas de accesos disponibles.

Este proyecto vive separado del frontend operativo principal. Su responsabilidad termina cuando el usuario autenticado selecciona un área y es redirigido a la aplicación correspondiente.

## Tecnologías

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 8
- TanStack Query
- React Hook Form + Zod
- Radix UI
- Motion
- Zustand
- Sonner
- Vitest, Testing Library y Playwright
- ESLint, Prettier y React Doctor

## Requisitos

- Node.js 22.22 o superior
- npm 10.9 o superior

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

La aplicación utiliza el puerto `5174` para poder ejecutarse al mismo tiempo que el frontend principal de Mesa de Ayuda, configurado normalmente en el puerto `5173`.

## Credenciales de demostración

El modo simulado está activo de manera predeterminada en `.env.example`.

```text
Correo: sofia.huerta@institucion.gob.mx
Contraseña: MesaAyuda2026!
Código de verificación: 123456
```

Estas credenciales existen únicamente para la demostración local. No deben copiarse a producción.

## Rutas

| Ruta | Función |
|---|---|
| `/login` | Inicio de sesión |
| `/mfa/configurar` | Configuración inicial del segundo factor |
| `/mfa/verificar` | Verificación recurrente del código OTP |
| `/acceso-correcto` | Transición de autenticación completada |
| `/accesos` | Tarjetas de áreas y permisos disponibles |
| `/recuperar-acceso` | Base visual para recuperación de cuenta |

## Comandos de calidad

```bash
npm run validate:structure
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run doctor
npm run build
```

El comando integral es:

```bash
npm run quality
```

## Integración con backend

Para desactivar los datos simulados:

```env
VITE_ENABLE_MOCKS=false
VITE_API_URL=https://api.institucional.gob.mx
```

Consulta `docs/INTEGRACION_BACKEND.md` para revisar los contratos esperados.
