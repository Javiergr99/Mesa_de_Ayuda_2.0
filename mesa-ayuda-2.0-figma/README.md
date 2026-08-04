# Mesa de Ayuda 2.0

Base frontend escalable construida a partir del diseño oficial de Figma de Mesa de Ayuda 2.0.

## Alcance implementado

- Layout Desktop oficial con header y sidebar fijos.
- Dashboard administrativo.
- Organizador con vistas Mensual, Semanal y Lista.
- Atenciones con vista Tabla, vista Tablero y detalle de solo lectura.
- Registrar Nueva Atención con validación, guardado, borrador y confirmación.
- Seguimiento con filtros, tabla, drawer de actualización, Resumen, Historial, Archivos y toasts.
- Rutas preparadas para Minería, Usuarios y Configuración.

## Tecnologías

- React + TypeScript.
- Vite y Tailwind CSS.
- React Router.
- TanStack Query.
- React Hook Form + Zod.
- Radix UI.
- Motion.
- Sonner.
- Vitest, Testing Library y Playwright.
- ESLint, Prettier y React Doctor.

## Requisitos

- Node.js 22.22 o superior.
- npm 10.9 o superior.

## Instalación

```bash
npm install
npm run dev
```

La aplicación se abre en `http://127.0.0.1:5173`.

## Validación de calidad

```bash
npm run typecheck
npm run lint
npm run test
npm run doctor
```

Para una auditoría detallada:

```bash
npm run doctor:verbose
```

## Construcción

```bash
npm run build
npm run preview
```

## Variables de entorno

Copie `.env.example` como `.env.local` y ajuste la URL del backend cuando se conecte la API real.

## Referencia Figma

Archivo de diseño: `Mesa de Ayuda 2.0` — file key `QajWuVBDoFpZ4bSQqI4ZML`.

El proyecto implementa las pantallas aprobadas disponibles. Los módulos todavía no maquetados permanecen como rutas preparadas para incorporarse sin alterar el layout ni la arquitectura.

## Estructura resumida

```text
src/
├── app/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── dashboard/
│   ├── organizer/
│   ├── attentions/
│   ├── attention-create/
│   ├── tracking/
│   └── placeholders/
└── shared/
```

Consulte `docs/ARQUITECTURA.md` para las decisiones de organización y crecimiento.
