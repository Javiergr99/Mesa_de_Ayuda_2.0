import { describe, expect, it } from "vitest";

import { mapBitacoraToAttention } from "@/features/attentions/model/attention.mapper";

describe("bitácora mapper", () => {
  it("convierte el contrato API a la vista de atención", () => {
    const result = mapBitacoraToAttention({
      id: "12345678-1234-1234-1234-123456789abc",
      nombre: "María",
      primer_apellido: "López",
      correo: "maria@example.gob.mx",
      estatus_id: 1,
      estatus: { id: 1, clave: "PENDIENTE", nombre: "Pendiente" },
      tipo_caso_id: 6,
      tipo_caso: { id: 6, clave: "SOPORTE_TECNICO", nombre: "Soporte técnico" },
      tipo_registro_id: 5,
      entidad_federativa_id: 33,
      creado_por: "usuario-creador-uuid",
      created_at: "2026-08-06T20:00:00Z",
    }, [
      { id: 5, clave: "GENERAL", nombre: "Atención general", activo: true, orden: 5 },
    ], [], [], [
      { id: 33, clave: "PFPNNA", nombre: "PFPNNA", activo: true, orden: 33 },
    ]);

    expect(result.requester).toBe("María López");
    expect(result.status).toBe("Pendiente");
    expect(result.caseType).toBe("Soporte técnico");
    expect(result.registry).toBe("GENERAL");
    expect(result.entity).toBe("PFPNNA");
    expect(result.createdBy).toBe("usuario-creador-uuid");
    expect(result.reference).toContain("12345678");
  });

  it("resuelve un tipo nuevo desde el catálogo sin codificar su ID", () => {
    const result = mapBitacoraToAttention(
      { id: "12345678-1234-1234-1234-123456789abc", tipo_registro_id: 42 },
      [{ id: 42, clave: "NUEVO_MODULO", nombre: "Nuevo módulo", activo: true, orden: 10 }],
    );

    expect(result.registry).toBe("NUEVO_MODULO");
  });
  it("resuelve una entidad nueva sin codificar identificadores", () => {
    const item = mapBitacoraToAttention(
      { id: "12345678-1234-1234-1234-123456789abc", entidad_federativa_id: 44 },
      [], [], [],
      [{ id: 44, clave: "ENTIDAD_NUEVA", nombre: "Entidad adicional", activo: true, orden: 44 }],
    );
    expect(item.entity).toBe("Entidad adicional");
  });

  it("respeta un estatus nuevo recibido desde el catálogo", () => {
    const item = mapBitacoraToAttention(
      { id: "12345678-1234-1234-1234-123456789abc", estatus_id: 21, tipo_caso_id: 15 },
      [],
      [{ id: 15, clave: "OTRO_NUEVO", nombre: "Nuevo caso", activo: true, orden: 15 }],
      [{ id: 21, clave: "ESCALADA", nombre: "Escalada", activo: true, orden: 21 }],
    );
    expect(item.status).toBe("Escalada");
    expect(item.caseType).toBe("Nuevo caso");
  });
});
