import { useState } from "react";
import { FileText, Mail, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import {
  useAttentionFiles,
  useReplaceAttentionFile,
  useUploadAttentionFile,
} from "@/features/attentions/api/attentions.queries";
import type { Attention } from "@/features/attentions/model/attention.types";
import {
  ATTENTION_ATTACHMENT_ACCEPT,
  validateAttentionAttachment,
} from "@/shared/files/attention-attachment.rules";

export function TrackingDrawerFiles({
  attention,
  canManageFiles,
}: {
  attention: Attention;
  canManageFiles: boolean;
}) {
  const filesQuery = useAttentionFiles(attention.id);
  const uploadMutation = useUploadAttentionFile();
  const replaceMutation = useReplaceAttentionFile();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  async function handleUploadFiles() {
    if (!pendingFiles.length) return;

    try {
      await Promise.all(
        pendingFiles.map((file) =>
          uploadMutation.mutateAsync({
            id: attention.id,
            file,
          }),
        ),
      );

      setPendingFiles([]);
      toast.success("Archivos adjuntados correctamente");
    } catch (error) {
      toast.error("No fue posible adjuntar los archivos", {
        description: error instanceof Error ? error.message : "La API rechazó el archivo.",
      });
    }
  }

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <section>
        <h3 className="text-base font-bold text-slate-900">Archivos relacionados</h3>

        <div className="mt-4 space-y-3">
          {filesQuery.isPending ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Consultando archivos activos…
            </div>
          ) : filesQuery.error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {filesQuery.error instanceof Error
                ? filesQuery.error.message
                : "No fue posible consultar los archivos."}
            </div>
          ) : filesQuery.data?.length ? (
            filesQuery.data.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  {file.isEmail ? <Mail className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{file.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {file.size} · {file.date}
                  </p>
                </div>

                {canManageFiles ? (
                  <label className="focus-ring cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">
                    Reemplazar
                    <input
                      type="file"
                      accept={ATTENTION_ATTACHMENT_ACCEPT}
                      className="sr-only"
                      disabled={replaceMutation.isPending}
                      onChange={(event) => {
                        const nextFile = event.target.files?.[0];
                        event.currentTarget.value = "";

                        if (!nextFile) return;

                        const validation = validateAttentionAttachment(nextFile);

                        if (!validation.valid) {
                          toast.error("Archivo no válido", {
                            description: validation.message,
                          });
                          return;
                        }

                        void replaceMutation
                          .mutateAsync({
                            id: attention.id,
                            fileId: file.id,
                            file: nextFile,
                          })
                          .then(() => toast.success("Archivo reemplazado correctamente"))
                          .catch((error: unknown) =>
                            toast.error("No fue posible reemplazar el archivo", {
                              description:
                                error instanceof Error
                                  ? error.message
                                  : "La API rechazó el archivo.",
                            }),
                          );
                      }}
                    />
                  </label>
                ) : (
                  <Badge tone="slate">Solo metadatos</Badge>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No hay archivos activos relacionados con esta atención.
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-base font-bold text-slate-900">Adjuntar evidencia de seguimiento</h3>

        {canManageFiles ? (
          <>
            <div className="mt-4">
              <FileDropzone
                files={pendingFiles}
                onFilesChange={setPendingFiles}
                accept={ATTENTION_ATTACHMENT_ACCEPT}
                helperText="Seleccione archivos permitidos por el contrato actual."
                validateFile={validateAttentionAttachment}
                onValidationError={(message) =>
                  toast.error("Archivo no válido", {
                    description: message,
                  })
                }
              />
            </div>

            {pendingFiles.length ? (
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  onClick={() => void handleUploadFiles()}
                  disabled={uploadMutation.isPending}
                >
                  <UploadCloud className="h-4 w-4" />
                  {uploadMutation.isPending ? "Adjuntando..." : "Adjuntar archivos"}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Su cuenta no tiene permiso para adjuntar o reemplazar archivos.
          </div>
        )}
      </div>
    </div>
  );
}
