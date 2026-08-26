# Ajuste del formulario Registrar Nueva Atención

## Objetivo

Alinear la captura del frontend con el contrato técnico y funcional vigente de API Mesa de Ayuda sin inventar endpoints ni campos fuera del esquema documentado.

## Campos de captura alineados

El formulario trabaja con los campos que el cliente puede enviar al crear una bitácora:

- `nombre`
- `primer_apellido`
- `segundo_apellido`
- `fecha`
- `hora`
- `instancia`
- `correo`
- `telefono`
- `observaciones`
- `entidad_federativa_id`
- `tipo_caso_id`
- `estatus_id`
- `tipo_registro_id`

`creado_por` no se captura: se obtiene del JWT. `atendido_por` tampoco se solicita como UUID manual; al omitirse, la API asigna al usuario autenticado según el contrato actual.

## Catálogos

Se centralizó el catálogo provisional de entidades federativas en `src/shared/catalogs/federal-entities.ts`, incluyendo las 32 entidades y PFPNNA con id 33. El mismo catálogo se reutiliza en Perfil y en el mapper de bitácoras.

Los catálogos de estatus, tipo de caso y tipo de registro siguen centralizados localmente porque el contrato actual no expone endpoints de catálogos.

## Arquitectura aplicada

- Esquema y valores iniciales: `attention-form.schema.ts`
- Mapeo UI → API: `attention-form.mapper.ts`
- Resumen de campos automáticos: `system-assignment-summary.tsx`
- Catálogo compartido de entidades: `shared/catalogs/federal-entities.ts`
- Conversión genérica de catálogo a opciones de select: `shared/catalogs/catalog.types.ts`

El formulario deja de mantener los IDs de catálogo en estados separados y los integra a React Hook Form mediante `Controller`.

## Adjuntos

Se conserva el contrato vigente:

- PDF
- DOCX
- XLSX
- CSV
- MSG
- EML
- máximo 20 MB por archivo

## Validación realizada

- Transpilación sintáctica de los archivos TypeScript/TSX del proyecto.
- Verificación de importaciones locales `@/`.
- Pruebas unitarias añadidas para el mapper del formulario y actualización de pruebas de entidad/PFPNNA.

La ejecución completa de `npm run typecheck`, `npm run test` y `npm run build` debe realizarse en el entorno local con las dependencias instaladas.
