import { CloudUpload, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/cn";

type FileDropzoneProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
  validateFile?: (
    file: File,
  ) => { valid: true } | { valid: false; message: string };
  onValidationError?: (message: string) => void;
  className?: string;
};

function getFileKey(file: File): string {
  return [
    file.name,
    file.size,
    file.lastModified,
    file.type || "unknown",
  ].join(":");
}

export function FileDropzone({
  files,
  onFilesChange,
  accept,
  multiple = true,
  helperText,
  validateFile,
  onValidationError,
  className,
}: FileDropzoneProps) {
  function handleFiles(list: FileList | null) {
    if (!list?.length) return;

    const incoming = Array.from(list);
    const accepted: File[] = [];

    for (const file of incoming) {
      const result =
        validateFile?.(file) ?? { valid: true as const };

      if (!result.valid) {
        onValidationError?.(result.message);
        continue;
      }

      accepted.push(file);
    }

    onFilesChange(
      multiple
        ? [...files, ...accepted]
        : accepted.slice(0, 1),
    );
  }

  const removeFile = (fileToRemove: File) => {
    onFilesChange(
      files.filter((file) => file !== fileToRemove),
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="focus-ring flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500 bg-blue-50/20 px-6 text-center transition hover:bg-blue-50/50">
        <CloudUpload
          className="h-8 w-8 text-blue-600"
          aria-hidden="true"
        />

        <strong className="mt-3 text-sm text-slate-800">
          Arrastre y suelte sus archivos aquí
        </strong>

        <span className="mt-1 text-xs text-slate-500">
          {helperText ?? "o haga clic para explorar"}
        </span>

        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />
      </label>

      {files.length ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={getFileKey(file)}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <FileText
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Quitar ${file.name}`}
                onClick={() => removeFile(file)}
              >
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
