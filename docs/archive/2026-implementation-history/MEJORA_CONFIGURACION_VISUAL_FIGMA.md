# Mejora del main — Configuración visual

Se adaptó el main de `Configuración visual` al diseño aprobado en Figma sin modificar la estructura ni el comportamiento existente del `AppHeader`, `AppSidebar` o `AppShell`.

## Estructura

- Encabezado compacto con breadcrumb, badge global y acciones.
- Aviso informativo de alcance global.
- Navegación interna reutilizable para categorías de configuración.
- Editor de colores agrupado por marca, superficies, textos y estados semánticos.
- Campo atómico de token con indicador de contraste, swatch, hexadecimal y estado `Editado`.
- Resumen de cambios pendientes.
- Vista previa sticky de escritorio con contextos y estados.

## Arquitectura

Los componentes visuales nuevos viven en `src/features/appearance-settings/components` y están pensados para reutilizarse en las próximas categorías aprobadas. Los Design Tokens continúan centralizados en el store y en `design-tokens.css`.

Se ampliaron los tokens de color sin romper configuraciones guardadas previamente: el store mezcla cualquier configuración anterior con `DEFAULT_APPEARANCE`.

## Alcance funcional actual

Los cambios siguen teniendo vista previa en tiempo real y persistencia local. El botón `Publicar cambios` conserva la interfaz aprobada, pero no simula una publicación global que todavía no tiene contrato de persistencia en backend; informa esta condición mediante un toast.
