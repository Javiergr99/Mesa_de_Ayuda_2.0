# Parche — Administración de usuarios

Este parche integra el frame Figma `admin-usuarios-listado` (`52:281`) en el frontend operativo `mesa-ayuda-2.0-figma`.

## Aplicación

Desde la raíz del repositorio:

```powershell
cd "C:\Users\Usuario\Desktop\Mesa_Ayuda-2.0"

Expand-Archive `
  -Path "$env:USERPROFILE\Downloads\mesa-ayuda-admin-usuarios-figma-parche.zip" `
  -DestinationPath "." `
  -Force

cd ".\mesa-ayuda-2.0-figma"
npm install
npm run dev -- --force
```

No se agregaron dependencias nuevas.

## Modo de demostración

El módulo usa datos locales cuando esta variable es `true` o no existe:

```env
VITE_ENABLE_ADMIN_MOCKS=true
```

Para conectar endpoints reales:

```env
VITE_ADMIN_API_URL=http://127.0.0.1:8000
VITE_ENABLE_ADMIN_MOCKS=false
```

## Rutas

- `/app/usuarios`
- `/app/usuarios/historial`
- `/app/configuracion/apariencia`

## Configuración visual

Los cambios de apariencia se aplican con Design Tokens y se guardan localmente en el navegador. Para publicar la configuración a todos los usuarios será necesario conectar el mismo modelo con un endpoint institucional de configuración.
