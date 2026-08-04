# Integración con backend

El frontend utiliza el patrón Repository para separar la interfaz de los servicios de autenticación.

## Inicio de sesión

```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "sofia.huerta@institucion.gob.mx",
  "password": "********"
}
```

Respuesta esperada:

```json
{
  "tempToken": "token-temporal",
  "requiresMfaSetup": false,
  "user": {
    "id": "usr-001",
    "name": "Arq. Sofía Huerta",
    "email": "sofia.huerta@institucion.gob.mx",
    "role": "Administrador",
    "area": "Mesa de Control TI",
    "scope": "Nacional",
    "accountStatus": "active",
    "mfaConfigured": true
  }
}
```

## Verificación del segundo factor

```http
POST /auth/2fa/verify

{
  "temp_token": "token-temporal",
  "code": "123456"
}
```

## Confirmación de configuración inicial

```http
POST /auth/2fa/confirm

{
  "temp_token": "token-temporal",
  "code": "123456"
}
```

## Cierre de sesión

```http
POST /auth/logout
```

Todas las solicitudes utilizan `credentials: include` para permitir cookies HttpOnly.

## Permisos

En una integración completa se recomienda sustituir el repositorio simulado por un endpoint como:

```http
GET /auth/accesses
```

La respuesta debe indicar área, módulos, permisos, nivel de acceso y URL o código de destino. La autorización efectiva siempre debe validarse nuevamente en el backend de cada aplicación; ocultar una tarjeta en el frontend no constituye un control de seguridad.
