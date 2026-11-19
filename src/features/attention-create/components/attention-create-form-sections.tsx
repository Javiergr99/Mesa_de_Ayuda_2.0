import { DatePickerField } from "@/components/ui/date-picker-field";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerField } from "@/components/ui/time-picker-field";
import { SystemAssignmentSummary } from "@/features/attention-create/components/system-assignment-summary";
import type { AttentionFormValues } from "@/features/attention-create/model/attention-form.schema";
import { operationalOptions, useCaseCatalog, useEntityCatalog, useStatusCatalog } from "@/features/attentions/api/operational-catalogs";
import { registryOptions, useRegistryCatalog } from "@/features/attentions/api/registry-catalog";
import {
  ATTENTION_ATTACHMENT_ACCEPT,
  validateAttentionAttachment,
} from "@/shared/files/attention-attachment.rules";
import { ClipboardCheck, FileText, MapPin, UserRound } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import { toast } from "sonner";


type FormFieldsProps = {
  register: UseFormRegister<AttentionFormValues>;
  errors: FieldErrors<AttentionFormValues>;
};

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function AttentionPersonSection({ register, errors }: FormFieldsProps) {
  return (
    <SectionCard title="Datos de la persona" icon={<UserRound className="h-4 w-4" />}>
      <div className="grid gap-x-3.5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Nombre(s)"
          maxLength={100}
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Primer apellido"
          maxLength={100}
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label="Segundo apellido"
          maxLength={100}
          {...register("secondName")}
          error={errors.secondName?.message}
        />
        <Input
          type="email"
          label="Correo electrónico"
          maxLength={200}
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          type="tel"
          label="Teléfono"
          maxLength={20}
          {...register("phone")}
          error={errors.phone?.message}
        />
      </div>
    </SectionCard>
  );
}

export function AttentionDetailsSection({
  register,
  control,
  errors,
}: FormFieldsProps & {
  control: Control<AttentionFormValues>;
}) {
  const entitiesQuery = useEntityCatalog();

  return (
    <SectionCard title="Datos de la atención" icon={<MapPin className="h-4 w-4" />}>
      <div className="grid gap-x-3.5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePickerField
              label="Fecha de atención"
              value={field.value ?? ""}
              onChange={field.onChange}
              maxDate={getTodayDateInputValue()}
              error={errors.date?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <TimePickerField
              label="Hora de atención"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.time?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="entityId"
          render={({ field }) => (
            <SelectField
              label="Entidad federativa / PFPNNA"
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Sin entidad asociada"
              options={operationalOptions(entitiesQuery.data ?? [])}
              disabled={entitiesQuery.isPending || entitiesQuery.isError}
              error={errors.entityId?.message}
            />
          )}
        />

        {entitiesQuery.isError ? (
          <p role="alert" className="text-xs text-red-600 md:col-span-2 xl:col-span-3">
            No fue posible cargar las entidades federativas. Actualice la página para reintentar.
          </p>
        ) : null}

        <div className="md:col-span-2 xl:col-span-3">
          <Input
            label="Institución, área o instancia"
            maxLength={150}
            {...register("instance")}
            error={errors.instance?.message}
          />
        </div>
      </div>
    </SectionCard>
  );
}

export function AttentionClassificationSection({
  control,
  errors,
  userName,
}: {
  control: Control<AttentionFormValues>;
  errors: FieldErrors<AttentionFormValues>;
  userName: string;
}) {
  const casesQuery = useCaseCatalog();
  const statusesQuery = useStatusCatalog();

  return (
    <SectionCard title="Clasificación y asignación" icon={<ClipboardCheck className="h-4 w-4" />}>
      <div className="grid gap-x-3.5 gap-y-4 md:grid-cols-2">
        <Controller
          control={control}
          name="caseTypeId"
          render={({ field }) => (
            <SelectField
              label="Tipo de caso"
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Sin clasificación"
              options={operationalOptions(casesQuery.data ?? [])}
              error={errors.caseTypeId?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="statusId"
          render={({ field }) => (
            <SelectField
              label="Estatus"
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Sin clasificación"
              options={operationalOptions(statusesQuery.data ?? [])}
              error={errors.statusId?.message}
            />
          )}
        />
      </div>

      {casesQuery.isError || statusesQuery.isError ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          No fue posible cargar las clasificaciones. Actualice la página para reintentar.
        </p>
      ) : null}
      <div className="mt-4 border-t border-[var(--ui-border)] pt-4">
        <SystemAssignmentSummary userName={userName} />
      </div>
    </SectionCard>
  );
}

function RegistryTypeSelector({
  control,
  errors,
}: {
  control: Control<AttentionFormValues>;
  errors: FieldErrors<AttentionFormValues>;
}) {
  const catalogQuery = useRegistryCatalog();
  const options = registryOptions(catalogQuery.data ?? []);

  return (
    <Controller
      control={control}
      name="registryTypeId"
      render={({ field }) => (
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Tipo de registro</p>

          <div role="radiogroup" aria-label="Tipo de registro" className="flex flex-wrap gap-2">
            {options.map((option) => {
              const selected = field.value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => field.onChange(option.value)}
                  className={[
                    "inline-flex min-h-8 items-center gap-2 rounded-lg border px-3 py-1.5",
                    "text-xs font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-[var(--ui-border)] bg-[var(--ui-surface)] text-slate-600 hover:border-blue-300 hover:bg-blue-50/50",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "h-2.5 w-2.5 rounded-full border",
                      selected ? "border-blue-600 bg-blue-600" : "border-slate-400 bg-transparent",
                    ].join(" ")}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>

          {catalogQuery.isPending ? (
            <p role="status" className="mt-2 text-xs text-slate-500">Cargando tipos de registro...</p>
          ) : catalogQuery.isError ? (
            <div role="alert" className="mt-2 flex items-center gap-2 text-xs text-red-600">
              No se pudieron cargar los tipos de registro.
              <button type="button" className="font-semibold underline" onClick={() => void catalogQuery.refetch()}>
                Reintentar
              </button>
            </div>
          ) : options.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No hay tipos de registro activos.</p>
          ) : null}

          {errors.registryTypeId?.message ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.registryTypeId.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}

export function AttentionObservationsSection({
  register,
  control,
  errors,
  canUploadFiles,
  files,
  onFilesChange,
}: FormFieldsProps & {
  control: Control<AttentionFormValues>;
  canUploadFiles: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  return (
    <SectionCard title="Detalles de la atención" icon={<FileText className="h-4 w-4" />}>
      <RegistryTypeSelector control={control} errors={errors} />

      <div className="mt-4">
        <Textarea
          label="Observaciones"
          {...register("observations")}
          error={errors.observations?.message}
          className="min-h-28"
          placeholder="Descripción, solución o notas de la atención..."
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-slate-700">Archivos adjuntos</p>

        {canUploadFiles ? (
          <FileDropzone
            files={files}
            onFilesChange={onFilesChange}
            accept={ATTENTION_ATTACHMENT_ACCEPT}
            helperText="Formatos admitidos: PDF, DOCX, XLSX, CSV, MSG o EML · máximo 20 MB por archivo"
            validateFile={validateAttentionAttachment}
            onValidationError={(message) =>
              toast.error("Archivo no válido", {
                description: message,
              })
            }
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            No tiene permisos para adjuntar archivos en esta atención. Puede registrar la atención
            sin archivos.
          </div>
        )}
      </div>
    </SectionCard>
  );
}
