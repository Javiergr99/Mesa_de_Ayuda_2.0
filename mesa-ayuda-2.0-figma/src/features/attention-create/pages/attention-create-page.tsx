import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { AttentionCreateErrorDialog, type AttentionCreateFailureKind } from "@/features/attention-create/components/attention-create-error-dialog";
import {
  AttentionClassificationSection,
  AttentionDetailsSection,
  AttentionObservationsSection,
  AttentionPersonSection,
} from "@/features/attention-create/components/attention-create-form-sections";
import { AttentionCreateSuccessDialog } from "@/features/attention-create/components/attention-create-success-dialog";
import { mapAttentionFormToCreatePayload } from "@/features/attention-create/model/attention-form.mapper";
import {
  attentionFormSchema,
  createAttentionFormDefaults,
  type AttentionFormValues,
} from "@/features/attention-create/model/attention-form.schema";
import {
  useCreateAttention,
  useUploadAttentionFile,
} from "@/features/attentions/api/attentions.queries";
import type { Attention } from "@/features/attentions/model/attention.types";
import { getUserDisplayName } from "@/features/auth/model/auth.selectors";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { sessionHasExactAction } from "@/features/auth/services/jwt-actions";
import { MesaAyudaApiError } from "@/shared/api/mesa-ayuda-api-error";
import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

type UploadFileInput = {
  id: string;
  file: File;
};

type CreateFailure = {
  kind: AttentionCreateFailureKind;
  message: string;
};

async function uploadAttentionFiles(
  attentionId: string,
  files: File[],
  upload: (input: UploadFileInput) => Promise<unknown>,
): Promise<string[]> {
  const results = await Promise.all(
    files.map((file) =>
      upload({
        id: attentionId,
        file,
      })
        .then(() => null)
        .catch(
          (error: unknown) =>
            `${file.name}: ${
              error instanceof Error
                ? error.message
                : "no fue posible adjuntarlo"
            }`,
        ),
    ),
  );

  const warnings: string[] = [];

  for (const result of results) {
    if (result) warnings.push(result);
  }

  return warnings;
}

function getFailureKind(error: unknown): AttentionCreateFailureKind {
  if (error instanceof MesaAyudaApiError) return "request";
  if (error instanceof TypeError) return "connection";

  if (
    error instanceof Error &&
    /failed to fetch|network|conexi[oó]n|load failed|fetch failed/i.test(
      error.message,
    )
  ) {
    return "connection";
  }

  return "request";
}

export function AttentionCreatePage() {
  const user = useAuthStore((state) => state.user);
  const createMutation = useCreateAttention();
  const uploadMutation = useUploadAttentionFile();

  const canUploadFiles = sessionHasExactAction(
    user,
    MESA_AYUDA_ACTIONS.uploadLogFile,
  );

  const [files, setFiles] = useState<File[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdAttention, setCreatedAttention] = useState<Attention | null>(
    null,
  );
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [failure, setFailure] = useState<CreateFailure | null>(null);

  const userName = getUserDisplayName(user);

  const defaultValues = useMemo(
    () =>
      createAttentionFormDefaults({
        date: "",
        instance: user?.instancia?.nombre,
        entityId: user?.entidad_federativa_id,
      }),
    [user?.entidad_federativa_id, user?.instancia?.nombre],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AttentionFormValues>({
    resolver: zodResolver(attentionFormSchema),
    defaultValues,
  });

  async function onSubmit(values: AttentionFormValues) {
    setFailure(null);
    setUploadWarnings([]);

    try {
      const created = await createMutation.mutateAsync(
        mapAttentionFormToCreatePayload(values),
      );

      const warnings = await uploadAttentionFiles(
        created.id,
        files,
        (input) => uploadMutation.mutateAsync(input),
      );

      setCreatedAttention(created);
      setUploadWarnings(warnings);
      setSuccessOpen(true);
    } catch (error) {
      setFailure({
        kind: getFailureKind(error),
        message:
          error instanceof Error
            ? error.message
            : "No fue posible completar el registro.",
      });
    }
  }

  function resetForm() {
    reset(defaultValues);
    setFiles([]);
    setCreatedAttention(null);
    setUploadWarnings([]);
    setFailure(null);
  }

  function createAnother() {
    resetForm();
    setSuccessOpen(false);
  }

  function retrySubmit() {
    void handleSubmit(onSubmit)();
  }

  const busy =
    isSubmitting || createMutation.isPending || uploadMutation.isPending;

  return (
    <div className="app-page pb-20">
      <PageHeading
        eyebrow={
          <>
            <span>Dashboard</span>{" "}
            <span className="px-1">›</span>{" "}
            <span className="text-blue-600">Registrar Atención</span>
          </>
        }
        title="Registrar Nueva Atención"
        actions={
          <Button asChild variant="secondary">
            <Link to="/app/atenciones">
              <ArrowLeft className="h-4 w-4" />
              Regresar
            </Link>
          </Button>
        }
      />

      <p className="mb-4 -mt-1 text-sm text-slate-500">
        Ingrese los datos para registrar una nueva atención en el sistema.
      </p>

      <form
        id="attention-form"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className="space-y-4"
      >
        <AttentionPersonSection register={register} errors={errors} />

        <AttentionDetailsSection
          register={register}
          control={control}
          errors={errors}
        />

        <AttentionClassificationSection
          control={control}
          errors={errors}
          userName={userName}
        />

        <AttentionObservationsSection
          register={register}
          control={control}
          errors={errors}
          canUploadFiles={canUploadFiles}
          files={files}
          onFilesChange={setFiles}
        />
      </form>

      <AttentionCreateActions busy={busy} />

      <AttentionCreateSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        attention={createdAttention}
        uploadWarnings={uploadWarnings}
        userName={userName}
        onCreateAnother={createAnother}
      />

      <AttentionCreateErrorDialog
        open={Boolean(failure)}
        onOpenChange={(open) => {
          if (!open) setFailure(null);
        }}
        kind={failure?.kind ?? "request"}
        message={failure?.message ?? ""}
        busy={busy}
        onRetry={retrySubmit}
      />
    </div>
  );
}

function AttentionCreateActions({ busy }: { busy: boolean }) {
  return (
    <div className="fixed bottom-0 left-[var(--sidebar-current-width)] right-0 z-20 border-t border-[var(--ui-border)] bg-[var(--ui-surface)]/95 py-2.5 shadow-[0_-8px_24px_rgb(15_23_42/0.05)] backdrop-blur transition-[left] duration-150 ease-out motion-reduce:transition-none">
      <div className="app-content-actions flex min-h-11 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="secondary">
          <Link to="/app/atenciones">Cancelar</Link>
        </Button>

        <Button type="submit" form="attention-form" disabled={busy}>
          <Save className="h-4 w-4" />
          {busy ? "Registrando atención..." : "Registrar atención"}
        </Button>
      </div>
    </div>
  );
}
