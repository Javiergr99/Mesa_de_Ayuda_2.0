/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ADMIN_API_URL?: string;
  readonly VITE_ENABLE_ADMIN_MOCKS?: string;
  readonly VITE_AUTH_APP_URL?: string;
  readonly VITE_MESA_AYUDA_API_URL?: string;
  readonly VITE_MESA_AYUDA_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
