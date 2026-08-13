import type { AppearanceConfig, FontFamilyOption } from "@/features/appearance-settings/model/appearance.types";

export const DEFAULT_APPEARANCE: AppearanceConfig = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  primaryActive: "#1e40af",
  secondary: "#6366f1",
  accent: "#f59e0b",
  canvas: "#f4f7fb",
  surface: "#ffffff",
  elevated: "#ffffff",
  header: "#ffffff",
  sidebar: "#0f1a31",
  fieldBackground: "#ffffff",
  textPrimary: "#111827",
  textSecondary: "#64748b",
  textDisabled: "#94a3b8",
  textOnPrimary: "#ffffff",
  sidebarText: "#94a3b8",
  border: "#dce3ec",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  fontFamily: "inter",
  headingWeight: 700,
  bodyWeight: 400,
  cardRadius: 12,
  controlRadius: 8,
};

export const FONT_STACKS: Record<FontFamilyOption, string> = {
  inter: '"Inter", "Segoe UI", Arial, sans-serif',
  "noto-sans": '"Noto Sans", "Segoe UI", Arial, sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

export const APPEARANCE_STORAGE_KEY = "mesa-ayuda-ui-appearance-v1";
