import { describe, expect, it } from "vitest";

import { mapAttentionFormToCreatePayload } from "@/features/attention-create/model/attention-form.mapper";

const baseValues = {
  name: "",
  firstName: "",
  secondName: "",
  date: "",
  time: "",
  instance: "",
  email: "",
  phone: "",
  observations: "",
  entityId: "",
  statusId: "",
  caseTypeId: "",
  registryTypeId: "",
};

describe("mapAttentionFormToCreatePayload", () => {
  it("omite cadenas vacías y catálogos no seleccionados", () => {
    expect(mapAttentionFormToCreatePayload(baseValues)).toEqual({
      nombre: undefined,
      primer_apellido: undefined,
      segundo_apellido: undefined,
      fecha: undefined,
      hora: undefined,
      instancia: undefined,
      correo: undefined,
      telefono: undefined,
      observaciones: undefined,
      entidad_federativa_id: undefined,
      estatus_id: undefined,
      tipo_caso_id: undefined,
      tipo_registro_id: undefined,
    });
  });

  it("mapea los campos del contrato y convierte IDs numéricos", () => {
    expect(
      mapAttentionFormToCreatePayload({
        ...baseValues,
        name: "  Ana ",
        firstName: "López",
        date: "2026-08-07",
        time: "12:30",
        instance: "PPNNA",
        email: "ana@example.com",
        phone: "5512345678",
        observations: "Seguimiento",
        entityId: "9",
        statusId: "1",
        caseTypeId: "6",
        registryTypeId: "5",
      }),
    ).toEqual({
      nombre: "Ana",
      primer_apellido: "López",
      segundo_apellido: undefined,
      fecha: "2026-08-07",
      hora: "12:30",
      instancia: "PPNNA",
      correo: "ana@example.com",
      telefono: "5512345678",
      observaciones: "Seguimiento",
      entidad_federativa_id: 9,
      estatus_id: 1,
      tipo_caso_id: 6,
      tipo_registro_id: 5,
    });
  });
});
