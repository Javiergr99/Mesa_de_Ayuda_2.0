# Módulo Mi perfil

Ruta protegida: `/app/perfil`.

La pantalla consume exclusivamente el usuario autenticado almacenado por `AuthSessionProvider`, cuya fuente es `GET /users/me`. No realiza peticiones adicionales ni permite editar información.

## Acceso

El enlace **Mi perfil** está disponible en el menú del usuario del header para cualquier sesión autenticada.

## Información mostrada

- Datos generales.
- Información institucional.
- Estado y seguridad de la cuenta.
- Accesos administrativos, solamente cuando la cuenta posee `ADMINISTRAR_USUARIOS` o `SUPER_ADMIN`.

Los permisos se interpretan desde `permisos.grupos[].modulos[].acciones[].nombre`. Los UUID no se utilizan para decisiones visuales.

## Componentes reutilizables

- `ProfileSummaryCard`
- `ReadOnlyDataCard`
- `ReadOnlyDataItem`
- `ProfileStatusBadge`
- `SecurityStatusItem`
- `AdministrativeAccessSummary`
- `InformationAlert`

La edición de datos permanece fuera de esta pantalla y corresponde al módulo de Administración de usuarios.
