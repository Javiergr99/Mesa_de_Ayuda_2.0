export function requiredRuntimeUrl(
  value: string | undefined,
  variableName: string,
  developmentFallback: string,
): string {
  const configured = value?.trim();

  if (configured) return configured.replace(/\/+$/, "");
  if (import.meta.env.DEV) return developmentFallback.replace(/\/+$/, "");

  throw new Error(
    `Falta la variable de entorno ${variableName}. Mesa de Ayuda no puede iniciar en producción sin esta configuración.`,
  );
}

export function optionalRuntimeUrl(value: string | undefined, developmentFallback: string): string {
  const configured = value?.trim();

  if (configured) return configured.replace(/\/+$/, "");
  return import.meta.env.DEV ? developmentFallback.replace(/\/+$/, "") : "";
}
