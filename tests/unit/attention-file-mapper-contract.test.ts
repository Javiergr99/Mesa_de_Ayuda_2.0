import { describe, expect, it } from "vitest";

import { mapArchivoToAttentionFile } from "@/features/attentions/model/attention.mapper";

describe("mapArchivoToAttentionFile", () => {
  it("conserva archivo_id devuelto por el contrato actual", () => {
    const result = mapArchivoToAttentionFile({
      archivo_id: "0832a6e9-7e83-49a6-972b-3645dd2d701e",
      nombre_original: "anomilas.xlsx",
      tipo_mime:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      tamano_bytes: 85418,
      es_correo_msg: false,
    });

    expect(result.id).toBe(
      "0832a6e9-7e83-49a6-972b-3645dd2d701e",
    );
    expect(result.name).toBe("anomilas.xlsx");
    expect(result.isEmail).toBe(false);
  });
});
