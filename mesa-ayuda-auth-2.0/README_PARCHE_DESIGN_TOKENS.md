# Parche de Design Tokens — Mesa de Ayuda Auth 2.0

Este parche centraliza colores, tipografía, espaciado, bordes, radios, sombras, transiciones y capas.

## Conserva

- Diseño actual del login.
- Header y footer amplios de Gobierno de México.
- Pantalla privada de accesos sin footer institucional.
- Colores particulares de las cuatro tarjetas de acceso.
- Flujo de login, recuperación, 2FA y acceso correcto.

## Agrega

- Tema `auth` para el flujo público.
- Tema `mesa-ayuda` para el área privada.
- Design Tokens globales.
- Componente `ThemeScope` tipado.
- Componente atómico `Typography`.
- Componentes UI conectados a variables semánticas.
- Tonos centralizados para tarjetas, badges y alertas.

## Aplicación

Desde la raíz del proyecto:

```powershell
Expand-Archive `
  -Path "$env:USERPROFILE\Downloads\mesa-ayuda-auth-design-tokens-parche.zip" `
  -DestinationPath "." `
  -Force

Remove-Item ".\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
npm run dev -- --force
```

Consulta `docs/SISTEMA_DE_DISENO.md` para modificar la identidad visual desde un solo lugar.
