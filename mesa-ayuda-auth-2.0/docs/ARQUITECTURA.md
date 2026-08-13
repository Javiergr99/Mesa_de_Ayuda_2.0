# Arquitectura — Portal Auth

## Alcance

Este frontend contiene exclusivamente autenticación, MFA, sesión, perfil y
selección de accesos. Los módulos operativos viven en
`mesa-ayuda-2.0-figma`.

## Estructura

```text
src/
├── api/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── access/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── model/
│   │   └── pages/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── model/
│   │   ├── pages/
│   │   ├── schemas/
│   │   └── services/
│   └── profile/
└── shared/
    ├── config/
    ├── constants/
    ├── hooks/
    ├── lib/
    └── theme/
```

## Principios

- Organización por funcionalidad.
- Componentes atómicos y reutilizables.
- TanStack Query para server-state.
- Zustand para estado de autenticación estrictamente efímero.
- Access token en memoria.
- Refresh token en cookie HttpOnly.
- MFA temporal en memoria.
- Guards para estados públicos, MFA pendiente y sesión autenticada.
- Code splitting por rutas.
- SSO mediante código temporal, nunca mediante JWT en URL.

## Flujo

```text
CURP + password
      ↓
temp_token MFA (memoria)
      ↓
setup/verificación TOTP
      ↓
access_token (memoria)
refresh_token (HttpOnly)
      ↓
GET /users/me
      ↓
/accesos
      ↓
redirect-code
```

## Recarga

La aplicación no intenta conservar el access token durante F5. En una nueva
carga, el marcador no sensible de sesión permite intentar `/users/me`; si el
Bearer ya no existe o expiró, el cliente coordina un único refresh mediante la
cookie HttpOnly y reintenta la operación.

## Rutas diferidas

Las páginas se importan dinámicamente mediante `React.lazy`. Guards, error
boundary y providers permanecen en el arranque para decidir acceso antes de
renderizar las pantallas diferidas.

## Escalabilidad

Agregar un nuevo acceso no requiere duplicar la sesión. El backend entrega
grupos/módulos/acciones y el frontend transforma esa información en `AccessItem`.
