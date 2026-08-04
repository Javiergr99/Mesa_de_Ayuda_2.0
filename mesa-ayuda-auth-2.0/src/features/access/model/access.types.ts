import type { LucideIcon } from "lucide-react";

export type AccessLevel = "full" | "limited" | "restricted" | "maintenance";

export type AccessTone = "blue" | "violet" | "emerald" | "amber";

export type AccessItem = {
  id: string;
  title: string;
  description: string;
  modules: string[];
  permissions: string[];
  level: AccessLevel;
  tone: AccessTone;
  badgeLabel?: string;
  buttonLabel?: string;
  icon: LucideIcon;
  destination: string;
};

export type AccessRepository = {
  getAccesses(): Promise<AccessItem[]>;
};
