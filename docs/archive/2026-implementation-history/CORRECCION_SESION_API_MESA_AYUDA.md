# Corrección de sesión al entrar a API Mesa de Ayuda

## Problema
Un `401 Unauthorized` devuelto por API Mesa de Ayuda podía provocar la renovación del token y, si esta renovación fallaba por cualquier motivo, limpiar la sesión global y redirigir al Login Universal.

## Regla aplicada
La API de negocio no es autoridad para destruir la sesión central.

- `401` de API Mesa de Ayuda: intentar refresh una vez.
- Si el refresh de `auth_service` responde `401`: la sesión central sí expiró y puede cerrarse.
- Si `auth_service` falla por red o `5xx`: conservar la sesión local.
- Si después de renovar el token API Mesa de Ayuda sigue respondiendo `401`: mostrar el error del módulo y conservar la sesión central.
- `403` nunca cierra la sesión; representa falta de acción/permisos.

## Entorno local
API Mesa de Ayuda se usa en `http://127.0.0.1:8001` mediante el proxy `/mesa-api` de Vite.

## Validación backend requerida
Conforme al contrato, API Mesa de Ayuda debe validar los JWT de `auth_service` con el mismo algoritmo y material de firma configurados para ese entorno. No se deben exponer los secretos al frontend.
