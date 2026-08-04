# Arquitectura del frontend

## Principios

1. **Organización por funcionalidad.** Cada módulo vive en `src/features` y conserva sus páginas, componentes, consultas, tipos y datos de desarrollo.
2. **Componentes compartidos pequeños.** Los elementos visuales reutilizables se ubican en `src/components/ui`; el layout oficial vive en `src/components/layout`.
3. **Estado remoto separado del estado visual.** TanStack Query administra datos asíncronos. El estado local se mantiene cerca del componente que lo utiliza.
4. **Contratos tipados.** Los tipos del dominio se definen una sola vez y se reutilizan en servicios, componentes y pruebas.
5. **Diseño accesible.** Radix UI resuelve foco, teclado y semántica de overlays; los componentes propios añaden etiquetas y estados visibles.
6. **Comentarios con propósito.** El código solo se comenta cuando existe una decisión, regla de negocio o comportamiento que no resulta evidente por sí mismo.

## Capas

- `app`: composición global, router, proveedores y estilos.
- `components`: componentes visuales compartidos y layout.
- `features`: módulos funcionales de negocio.
- `shared`: utilidades, configuración, adaptadores y tipos transversales.
- `tests`: pruebas unitarias y end-to-end.

## Integración futura con backend

Los servicios simulados de `features/attentions/api` deben sustituirse por llamadas al cliente HTTP institucional. Los hooks de TanStack Query no necesitan cambiar mientras el contrato devuelto sea el mismo.
