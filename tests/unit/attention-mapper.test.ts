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
      tipo_caso_id: 6,
      tipo_registro_id: 5,
      entidad_federativa_id: 33,
      created_at: "2026-08-06T20:00:00Z",
    });

    expect(result.requester).toBe("María López");
    expect(result.status).toBe("Pendiente");
    expect(result.caseType).toBe("Soporte técnico");
    expect(result.registry).toBe("GENERAL");
    expect(result.entity).toBe("PFPNNA");
    expect(result.reference).toContain("12345678");
  });
});
