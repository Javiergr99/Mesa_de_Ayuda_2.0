# Validación del proyecto

## Validaciones ejecutadas durante la generación

- Análisis sintáctico de todos los archivos `.ts` y `.tsx`: sin errores de parseo.
- Revisión de importaciones locales mediante alias `@/`: sin rutas faltantes.
- Revisión visual de las pantallas oficiales proporcionadas para Registrar Atención y Seguimiento.

## Validaciones preparadas para el entorno local

Después de instalar las dependencias, ejecute:

```bash
npm run validate:structure
npm run typecheck
npm run lint
npm run test
npm run doctor
npm run build
```

La ejecución de React Doctor requiere descargar el paquete oficial desde npm. El entorno usado para generar este archivo no permitió acceder al registro de paquetes, por lo que el comando quedó configurado, pero debe ejecutarse localmente después de `npm install`.
