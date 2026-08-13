import type { IdentityConfig } from "@/features/appearance-settings/model/identity.types";

export const DEFAULT_IDENTITY: IdentityConfig = {
  systemName: "Mesa de Ayuda 2.0",
  shortName: "MDA",
  versionText: "v2.0.4-beta",
  institutionalDescription: "Sistema de gestión de atención y soporte al usuario.",
  responsibleInstitution: "Sistema Nacional para el Desarrollo Integral de la Familia",
  institutionalInitials: "SNDIF",
  avatarMode: "initials",
  avatarInitials: "MA",
  avatarBackground: "#2563EB",
  avatarTextColor: "#FFFFFF",
  logoMinSize: 24,
  logoSafeSpace: 8,
  logoAlignment: "left",
  logoAllowedBackground: "all",
  useCompactVersion: true,
};

export const IDENTITY_STORAGE_KEY = "mesa-ayuda-ui-identity-v1";
