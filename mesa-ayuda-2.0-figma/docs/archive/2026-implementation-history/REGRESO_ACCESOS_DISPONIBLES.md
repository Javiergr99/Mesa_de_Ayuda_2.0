# Regreso a Accesos disponibles

Mesa de Ayuda muestra en el header global una acción **Accesos** que permite volver al selector de módulos del Login Universal.

## Comportamiento

- Visible desde cualquier ruta protegida de `mesa-ayuda-2.0-figma`.
- Reutiliza el componente `Button` existente.
- La navegación se centraliza en `features/auth/services/auth-navigation.ts`.
- El destino se deriva del origen configurado en `VITE_AUTH_APP_URL` y apunta a `/accesos`.
- No cierra sesión, no elimina tokens y no solicita un nuevo `redirect-code` al regresar.
- Desde Accesos disponibles, el usuario puede seleccionar otro módulo y continuar el flujo normal de `redirect-code`.

## Componentes

- `components/layout/access-hub-button.tsx`
- `features/auth/services/auth-navigation.ts`
- `components/layout/app-header.tsx`
