import { describe, expect, it } from "vitest";

import { buildAttentionFileFormData } from "@/features/attentions/api/attention-file-form-data";

describe("buildAttentionFileFormData", () => {
  it("usa multipart FormData con el campo exacto file", () => {
    const file = new File(["contenido"], "evidencia.pdf", {
      type: "application/pdf",
    });

    const formData = buildAttentionFileFormData(file);

    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("file")).toBe(file);
    expect(formData.get("archivo")).toBeNull();
    expect(Array.from(formData.keys())).toEqual(["file"]);
  });
});
