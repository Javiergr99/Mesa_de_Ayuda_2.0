# Mejoras de densidad visual y navegación

## Objetivo

Recuperar del diseño anterior una navegación lateral más delgada y una distribución central más limpia, sin modificar la identidad visual aprobada de Mesa de Ayuda 2.0.

## Cambios implementados

- Sidebar contraído de 56 px en escritorio y 52 px en móvil.
- Sidebar expandido de 224 px.
- Íconos de 18 px y opciones de 40 px de alto.
- Expansión mediante hover o foco de teclado.
- Cierre automático al navegar.
- El `main` se adapta al ancho del sidebar y nunca queda debajo de él.
- Contenido central con ancho máximo de 1180 px.
- Separación uniforme de 20 px entre bloques principales.
- Encabezados, tarjetas estadísticas y secciones con una densidad visual más compacta.
- Barra fija del formulario alineada con el mismo contenedor central.

## Acceso a configuración

La opción Configuración se muestra únicamente cuando `/users/me` informa alguna de estas acciones:

- `ADMINISTRAR_USUARIOS`
- `SUPER_ADMIN`

La ruta también está protegida; ocultar el enlace no sustituye la validación de acceso.

## Apariencia universal

La versión vigente de `auth_service` no publica una capacidad para persistir y distribuir Design Tokens entre usuarios y dispositivos. Por esa razón:

- El frontend guarda actualmente la apariencia en `localStorage`.
- Los cambios se sincronizan entre pestañas del mismo navegador mediante el evento `storage`.
- No se presenta esta persistencia como institucional o universal.
- La publicación global queda registrada como requerimiento de backend y solo podrá conectarse cuando aparezca en el OpenAPI vigente.
