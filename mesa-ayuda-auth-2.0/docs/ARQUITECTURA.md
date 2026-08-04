# Arquitectura

## Separación de responsabilidades

Este repositorio contiene solamente el portal de autenticación y accesos. No incluye Dashboard, Atenciones, Seguimiento, Organizador ni los demás módulos operativos.

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── model/
│   │   ├── pages/
│   │   └── schemas/
│   └── access/
│       ├── api/
│       ├── components/
│       ├── data/
│       ├── model/
│       └── pages/
└── shared/
    ├── config/
    ├── constants/
    ├── lib/
    └── types/
```

## Principios aplicados

- Organización por funcionalidad para evitar carpetas globales difíciles de mantener.
- Componentes atómicos para botones, campos, alertas, OTP, badges, tarjetas, diálogos y estados de carga.
- Repositorios intercambiables para usar datos simulados o servicios HTTP reales.
- Rutas protegidas según el estado de autenticación.
- Estado de sesión mínimo y aislado en `sessionStorage` solamente para la demostración local.
- Navegación hacia aplicaciones externas mediante variables de entorno.
- Diseño consistente con la identidad visual del frontend principal de Mesa de Ayuda 2.0.

## Flujo

```text
Credenciales
   ↓
Token temporal
   ↓
Configuración o verificación MFA
   ↓
Sesión autenticada mediante cookie HttpOnly
   ↓
Consulta de permisos
   ↓
Selección del área autorizada
   ↓
Redirección a la aplicación correspondiente
```

## Escalabilidad

Para incorporar nuevas áreas solo se debe agregar una definición compatible con `AccessItem`. Las tarjetas, badges, modal de permisos y estados visuales se reutilizan sin duplicar la implementación.
