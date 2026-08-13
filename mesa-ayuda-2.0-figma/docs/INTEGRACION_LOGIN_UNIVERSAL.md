# Integración con el portal de autenticación

## Flujo vigente

1. `mesa-ayuda-auth-2.0` autentica CURP, contraseña y MFA.
2. El usuario selecciona una aplicación autorizada.
3. Auth solicita `POST /auth/redirect-code` con un destino limpio y permitido.
4. El navegador navega al frontend operativo con `code` y una preferencia no sensible de persistencia.
5. Mesa de Ayuda valida que la ruta sea una entrada permitida.
6. El código se elimina inmediatamente de la URL.
7. Se ejecuta `POST /auth/exchange-code`.
8. `auth_service` devuelve el access token para memoria y establece/rota el refresh token mediante cookie HttpOnly.
9. El frontend consulta `GET /users/me`.
10. Guards y navegación consumen las acciones del usuario.

Los JWT nunca viajan en la URL ni se guardan en Web Storage.

## Entradas autorizadas

```text
/app/dashboard
/app/formato-nna
/app/usuarios
```

La lista se centraliza en:

```text
src/features/auth/config/auth-entry-points.ts
```

La validación y limpieza de parámetros vive en:

```text
src/features/auth/services/exchange-navigation.ts
```

## Reglas del puente

- `code` es temporal y de un solo uso.
- No se intercambia un código desde una ruta distinta a las entradas autorizadas.
- No se aceptan fragmentos.
- No se aceptan códigos duplicados o vacíos.
- La URL se limpia antes de completar el intercambio.
- `persistence` expresa una preferencia de sesión, no una credencial.
- El access token resultante vive únicamente en memoria.
- El refresh token permanece fuera de JavaScript en cookie HttpOnly.

## Restauración tras F5

Al recargar:

1. el access token en memoria desaparece;
2. permanece únicamente el marcador no sensible de sesión;
3. una petición protegida intenta restaurar la sesión;
4. `/auth/refresh` usa la cookie HttpOnly y rota la sesión;
5. el nuevo access token vuelve a memoria;
6. `/users/me` hidrata al usuario.

## Cierre

El cierre remoto usa `/auth/logout`, limpia el estado local y se sincroniza
entre pestañas mediante `BroadcastChannel`. La aplicación también fuerza logout
después de 60 minutos de inactividad.

## Variables

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_AUTH_APP_URL=http://127.0.0.1:5174/login
```

Use el mismo host (`127.0.0.1` en desarrollo) en todo el flujo para evitar
inconsistencias de cookies.
