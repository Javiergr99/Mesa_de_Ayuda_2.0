import { describe, expect, it } from "vitest";

import { validateAttentionAttachment } from "@/shared/files/attention-attachment.rules";

describe("attention attachment rules", () => {
  it("acepta extensiones documentadas", () => {
    const file = new File(["ok"], "solicitud.pdf", { type: "application/pdf" });
    expect(validateAttentionAttachment(file)).toEqual({ valid: true });
  });

  it("rechaza imágenes fuera del contrato", () => {
    const file = new File(["image"], "captura.png", { type: "image/png" });
    expect(validateAttentionAttachment(file)).toEqual(
      expect.objectContaining({ valid: false }),
    );
  });

  it("rechaza archivos superiores a 20 MB", () => {
    const file = new File(
      [new Uint8Array(20 * 1024 * 1024 + 1)],
      "evidencia.pdf",
      { type: "application/pdf" },
    );
    expect(validateAttentionAttachment(file)).toEqual(
      expect.objectContaining({ valid: false }),
    );
  });
});
