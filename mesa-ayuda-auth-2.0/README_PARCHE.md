# Corrección de Accesos disponibles

Este parche separa los layouts públicos y privados:

- Login, recuperación, MFA y confirmación continúan usando `GobMxHeader` y `GobMxFooter` mediante `AuthLayout`.
- `/accesos` utiliza el header propio de Mesa de Ayuda 2.0 mediante `AccessLayout`.
- La pantalla de accesos no muestra footer.

También ajusta la pantalla de accesos para reproducir el frame aprobado:

- Encabezado privado Mesa de Ayuda 2.0.
- Resumen compacto del usuario.
- Cuatro tarjetas: Mesa de Ayuda, Directorio PPNNA, Formato de NNA y Administración del sistema.
- Colores, permisos y botones por tarjeta.

## Recurso opcional

Copiar desde Medidas de Protección:

`perfil.webp`

hacia:

`public/assets/icons/perfil.webp`
