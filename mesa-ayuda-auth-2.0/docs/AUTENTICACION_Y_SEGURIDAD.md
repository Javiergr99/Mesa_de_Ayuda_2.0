# Autenticación y seguridad

## Reglas para producción

1. El token de acceso y el token de actualización no deben guardarse en `localStorage` ni exponerse al código del navegador.
2. La sesión debe establecerse mediante cookies `HttpOnly`, `Secure` y `SameSite` apropiadas.
3. El código OTP y la clave secreta del autenticador nunca deben persistirse en el frontend.
4. El backend debe aplicar límites de intentos, bloqueo temporal, expiración de tokens y auditoría.
5. La verificación MFA debe tolerar la ventana temporal definida por el backend; el frontend solo envía el código capturado.
6. El cierre de sesión debe invalidar la sesión en el servidor, limpiar el estado local y redirigir al login.
7. El portal debe implementar cierre por inactividad de acuerdo con el contrato institucional.

## Estado local incluido

La implementación simulada conserva únicamente el usuario de demostración y el token temporal de prueba en `sessionStorage`. Este comportamiento facilita el prototipado y debe sustituirse por el contrato real antes del despliegue.

## Accesibilidad

- Labels visibles en campos.
- Focus perceptible.
- OTP navegable mediante teclado.
- Mensajes de error asociados al control.
- Estados que no dependen únicamente del color.
- Áreas de interacción adecuadas.
- Diálogos administrados mediante Radix UI.

## Inactividad y sincronización entre pestañas

El componente `SessionSecurityProvider` programa el cierre automático después de 60 minutos sin actividad. Antes de limpiar el estado visual intenta cerrar la sesión en el backend. El cierre se comunica a las demás pestañas mediante `BroadcastChannel`, sin utilizar `localStorage` para compartir credenciales o tokens.
