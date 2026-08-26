# Arquitectura del frontend operativo

## Principios

1. **Organización por funcionalidad.** Cada dominio vive bajo `src/features`.
2. **Componentes compartidos pequeños.** `src/components/ui` concentra primitivas y `src/components/layout` el App Shell.
3. **Estado remoto separado del estado visual.** TanStack Query gestiona server-state y el estado efímero permanece cerca de su consumidor.
4. **Contratos tipados.** Servicios, repositorios, mappers y formularios comparten tipos explícitos.
5. **Autorización por acción.** Los guards mejoran UX; las APIs conservan la autoridad final.
6. **Seguridad de sesión.** Access token en memoria; el frontend está preparado para refresh mediante cookie HttpOnly, pendiente de alineación con `auth_service`.
7. **Carga progresiva.** Las páginas de ruta usan `React.lazy` para evitar un bundle monolítico.
8. **Accesibilidad y semántica.** Radix UI y componentes propios mantienen foco, teclado, labels y estados visibles.

## Capas

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── appearance-settings/
│   ├── attention-create/
│   ├── attentions/
│   ├── auth/
│   ├── dashboard/
│   ├── organizer/
│   ├── placeholders/
│   ├── profile/
│   ├── system-administration/
│   └── tracking/
└── shared/
    ├── api/
    ├── catalogs/
    ├── config/
    ├── files/
    ├── lib/
    └── permissions/
```

## Sesión

La aplicación entra mediante un código temporal autorizado:

```text
Auth :5174
   ↓ redirect-code
Mesa :5173?code=...
   ↓ limpiar URL
POST /auth/exchange-code
   ↓
access token en memoria
refresh cookie HttpOnly (pendiente de alineación con auth_service)
   ↓
GET /users/me
```

La preferencia `session`/`persistent` no contiene credenciales. Se utiliza para
indicar al backend si la cookie refresh debe ser de sesión o persistente.

Después de F5 el access token desaparece de memoria. El marcador no sensible
permite intentar restaurar la sesión y `auth_service` rota/valida la cookie
refresh antes de reintentar la operación protegida.

## APIs

### auth_service

Responsable de:

- identidad;
- sesión;
- `/users/me`;
- administración de usuarios y permisos;
- redirect/exchange code.

### API Mesa de Ayuda

Responsable del dominio operativo:

- bitácoras/atenciones;
- adjuntos;
- dashboard;
- futuros módulos operativos.

Las páginas no realizan `fetch()` directo; consumen hooks/servicios/repositorios.

## Rendimiento

Las páginas de Dashboard, Organizador, Atenciones, Seguimiento, Perfil,
Administración y Configuración se cargan mediante imports dinámicos.

Baseline observado:

- bundle principal antes de la división: ~959 kB;
- chunk principal posterior: **469.44 kB**;
- warning de Vite por `>500 kB`: eliminado.

No se aumenta `chunkSizeWarningLimit` para ocultar el diagnóstico.
