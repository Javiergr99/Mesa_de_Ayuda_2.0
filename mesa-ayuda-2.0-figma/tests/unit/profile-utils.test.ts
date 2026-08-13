import { describe, expect, it } from "vitest";

import type { AuthenticatedUser } from "@/features/auth/api/auth.contracts";
import {
  formatProfileDate,
  getAdministrativeAccessLabels,
  getFederalEntityName,
  getProfileInitials,
} from "@/features/profile/model/profile.utils";

const user: AuthenticatedUser = {
  id: "user-1",
  nombre: "Administrador",
  primer_apellido: "General",
  segundo_apellido: "Sistema",
  correo_electronico: "admin@example.com",
  curp: "AURA000101HDFXXX01",
  entidad_federativa_id: 9,
  numero_telefono: "5500000000",
  is_2fa_enabled: true,
  estatus: { id: 1, nombre: "Activo" },
  instancia: { id: 1, nombre: "Institución", siglas: "INST" },
  intentos_login: 0,
  fecha_creacion: "2026-07-02T19:08:31.905599Z",
  fecha_actualizacion: "2026-08-05T18:22:21.183840Z",
  permisos: {
    grupos: [
      {
        id: "group-1",
        nombre: "MESA_AYUDA",
        modulos: [
          {
            id: "module-1",
            nombre: "ADMINISTRACION_USUARIOS",
            acciones: [
              { id: "action-1", nombre: "SUPER_ADMIN" },
              { id: "action-2", nombre: "VER_USUARIOS" },
              { id: "action-3", nombre: "QUITAR_ACCIONES_USUARIO" },
            ],
          },
        ],
      },
    ],
  },
};

describe("profile utils", () => {
  it("builds three-letter initials", () => {
    expect(getProfileInitials(user)).toBe("AGS");
  });

  it("maps the federal entity and PFPNNA catalog entry", () => {
    expect(getFederalEntityName(9)).toBe("Ciudad de México");
    expect(getFederalEntityName(33)).toBe("PFPNNA");
  });

  it("formats profile dates in Spanish", () => {
    expect(formatProfileDate("2026-08-05T18:22:21.183840Z")).toContain("2026");
  });

  it("groups administrative permissions into readable labels", () => {
    expect(getAdministrativeAccessLabels(user)).toEqual(
      expect.arrayContaining([
        "Consulta de usuarios",
        "Retiro de permisos",
        "Administración global",
      ]),
    );
  });
});
