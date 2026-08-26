# Configuración visual — Identidad

La categoría **Identidad** reutiliza el App Shell y la navegación interna de Configuración visual. Se implementó como una sección del mismo módulo, sin crear una página paralela.

## Componentes reutilizables

- `SettingsSection`: estructura común para las categorías de configuración.
- `SettingsField`: etiqueta, estado editado y contenido de un control.
- `SettingsTextControl`: campos de texto compactos sobre `Input` y `Textarea` existentes.
- `IdentityAssetUploader`: carga y validación reutilizable de recursos gráficos.
- `IdentityCurrentAsset`: vista del recurso actual con reemplazo y eliminación.
- `SettingsSwitch`: interruptor atómico para reglas visuales.
- `AlternativeAssetRow`: patrón reutilizable de recursos alternativos.
- `IdentitySettingsPreview`: vista previa específica de identidad.

## Estado actual

Los campos de identidad se guardan como borrador local mientras se define el contrato de persistencia global de configuración. Los archivos seleccionados se mantienen como previsualizaciones de la sesión del navegador y no se presentan como cargas persistidas en backend.

La publicación global continúa pendiente del contrato de backend para Design Tokens y recursos institucionales.
