import { DatePickerField } from "@/components/ui/date-picker-field";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerField } from "@/components/ui/time-picker-field";
import { SystemAssignmentSummary } from "@/features/attention-create/components/system-assignment-summary";
import type { AttentionFormValues } from "@/features/attention-create/model/attention-form.schema";
import {
  ATTENTION_CASE_CATALOG,
  ATTENTION_REGISTRY_CATALOG,
  ATTENTION_STATUS_CATALOG,
} from "@/features/attentions/model/attention.catalogs";
import { catalogToSelectOptions } from "@/shared/catalogs/catalog.types";
import { FEDERAL_ENTITY_CATALOG } from "@/shared/catalogs/federal-entities";
import {
  ATTENTION_ATTACHMENT_ACCEPT,
  validateAttentionAttachment,
} from "@/shared/files/attention-attachment.rules";
import { ClipboardCheck, FileText, MapPin, UserRound } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

const ENTITY_OPTIONS = catalogToSelectOptions(FEDERAL_ENTITY_CATALOG);
const STATUS_OPTIONS = catalogToSelectOptions(ATTENTION_STATUS_CATALOG);
const CASE_TYPE_OPTIONS = catalogToSelectOptions(ATTENTION_CASE_CATALOG);
const REGISTRY_TYPE_OPTIONS = catalogToSelectOptions(ATTENTION_REGISTRY_CATALOG);

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
              options={ENTITY_OPTIONS}
              error={errors.entityId?.message}
            />
          )}
        />

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
              options={CASE_TYPE_OPTIONS}
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
              options={STATUS_OPTIONS}
              error={errors.statusId?.message}
            />
          )}
        />
      </div>

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
  return (
    <Controller
      control={control}
      name="registryTypeId"
      render={({ field }) => (
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Tipo de registro</p>

          <div role="radiogroup" aria-label="Tipo de registro" className="flex flex-wrap gap-2">
            {REGISTRY_TYPE_OPTIONS.map((option) => {
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
