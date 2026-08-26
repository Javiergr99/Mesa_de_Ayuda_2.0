const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL ?? "http://127.0.0.1:5174/login";

function authAppUrl(pathname: string): URL {
  const configured = new URL(AUTH_APP_URL, window.location.origin);
  return new URL(pathname, configured.origin);
}

export function buildAuthLoginUrl(reason?: string): string {
  const url = new URL(AUTH_APP_URL, window.location.origin);
  url.searchParams.set("return_url", window.location.href);
  if (reason) url.searchParams.set("reason", reason);
  return url.toString();
}

export function buildAuthLogoutUrl(reason?: string): string {
  const url = authAppUrl("/cerrar-sesion");
  if (reason) url.searchParams.set("reason", reason);
  return url.toString();
}

export function buildAccessHubUrl(): string {
  return authAppUrl("/accesos").toString();
}

export function redirectToAccessHub() {
  window.location.assign(buildAccessHubUrl());
}

export function redirectToAuthLogin(reason?: string) {
  window.location.replace(buildAuthLoginUrl(reason));
}

export function redirectToAuthLogout(reason?: string) {
  window.location.replace(buildAuthLogoutUrl(reason));
}
