export const ATTENTION_ATTACHMENT_MAX_BYTES = 20 * 1024 * 1024;
export const ATTENTION_ATTACHMENT_ACCEPT = ".pdf,.docx,.xlsx,.csv,.msg,.eml";
export const ATTENTION_ATTACHMENT_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".xlsx",
  ".csv",
  ".msg",
  ".eml",
] as const;

export type AttachmentValidationResult = { valid: true } | { valid: false; message: string };

function extensionOf(name: string): string {
  const index = name.lastIndexOf(".");
  return index >= 0 ? name.slice(index).toLowerCase() : "";
}

export function validateAttentionAttachment(file: File): AttachmentValidationResult {
  const extension = extensionOf(file.name);
  if (
    !ATTENTION_ATTACHMENT_EXTENSIONS.includes(
      extension as (typeof ATTENTION_ATTACHMENT_EXTENSIONS)[number],
    )
  ) {
    return {
      valid: false,
      message: `“${file.name}” no tiene una extensión permitida.`,
    };
  }

  if (file.size > ATTENTION_ATTACHMENT_MAX_BYTES) {
    return {
      valid: false,
      message: `“${file.name}” supera el límite de 20 MB.`,
    };
  }

  return { valid: true };
}
