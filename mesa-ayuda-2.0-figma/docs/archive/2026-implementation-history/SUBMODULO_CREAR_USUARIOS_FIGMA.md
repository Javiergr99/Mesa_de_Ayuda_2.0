# Submódulo Crear usuarios

Implementación de la interfaz aprobada en Figma para Administración de usuarios.

## Rutas

- `/app/usuarios`: listado y administración.
- `/app/usuarios/nuevo`: asistente de alta en cuatro pasos.
- `/app/usuarios/:userId/editar`: edición administrativa.

## Sidebar

`Usuarios` funciona como grupo desplegable y reutiliza el patrón de navegación anidada:

- Administrar usuarios
- Crear usuarios

Cada opción respeta las acciones del usuario autenticado.

## Alta

El asistente reutiliza los componentes existentes `Input`, `SelectField`, `Button`, `SearchField`, el catálogo de permisos y la capa `AdminUsersRepository`.

Pasos:

1. Datos del usuario.
2. Alcance y perfil.
3. Permisos.
4. Revisión.

La operación final conserva el contrato vigente:

1. `POST /users`
2. `POST /users/{user_id}/permisos`
3. `GET /users/{user_id}` cuando el actor tiene acceso al detalle.

No se envía contraseña desde el frontend.

## Edición

La pantalla de edición reutiliza `PATCH /users/{user_id}` y, cuando cambia el estatus, `PATCH /users/{user_id}/estatus/{estatus_id}`.

El diseño solicita un motivo administrativo. El contrato vigente de auth_service no publica un campo para persistirlo, por lo que se utiliza como confirmación visual local y se informa explícitamente en la interfaz.

## Componentes reutilizables

- `AdminUserCreateStepper`
- `AdminWizardFooter`
- `CompactPermissionTree`
- `AdminUserIdentityStep`
- `AdminUserScopeStep`
- `AdminUserPermissionsStep`
- `AdminUserReviewStep`
- `AdminUserCreateSuccess`

La lógica compartida del árbol de permisos se extrajo a `permission-tree-helpers.ts` para evitar duplicar la selección jerárquica entre el árbol existente y la variante compacta.
