/**
 * Construye el cuerpo multipart requerido por los endpoints de archivos
 * de Bitácora. El nombre del campo forma parte del contrato del backend.
 *
 * No se debe establecer manualmente Content-Type: el navegador agrega
 * multipart/form-data junto con el boundary correcto.
 */
export function buildAttentionFileFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}
