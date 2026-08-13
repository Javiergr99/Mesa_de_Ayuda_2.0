import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  ClipboardCheck,
  FileText,
  MapPin,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
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

const ENTITY_OPTIONS =
  catalogToSelectOptions(
    FEDERAL_ENTITY_CATALOG,
  );
const STATUS_OPTIONS =
  catalogToSelectOptions(
    ATTENTION_STATUS_CATALOG,
  );
const CASE_TYPE_OPTIONS =
  catalogToSelectOptions(
    ATTENTION_CASE_CATALOG,
  );
const REGISTRY_TYPE_OPTIONS =
  catalogToSelectOptions(
    ATTENTION_REGISTRY_CATALOG,
  );

type FormFieldsProps = {
  register: UseFormRegister<AttentionFormValues>;
  errors: FieldErrors<AttentionFormValues>;
};

export function AttentionPersonSection({
  register,
  errors,
}: FormFieldsProps) {
  return (
    <SectionCard
      title="Datos de la persona atendida"
      icon={
        <UserRound className="h-4 w-4" />
      }
    >
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
          error={
            errors.firstName?.message
          }
        />
        <Input
          label="Segundo apellido"
          maxLength={100}
          {...register("secondName")}
          error={
            errors.secondName?.message
          }
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
    <SectionCard
      title="Datos de la atención"
      icon={
        <MapPin className="h-4 w-4" />
      }
    >
      <div className="grid gap-x-3.5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <Input
          type="date"
          label="Fecha de atención"
          {...register("date")}
        />
        <Input
          type="time"
          label="Hora de atención"
          {...register("time")}
        />
        <Controller
          control={control}
          name="entityId"
          render={({ field }) => (
            <SelectField
              label="Entidad federativa / PFPNNA"
              value={field.value}
              onValueChange={
                field.onChange
              }
              placeholder="Sin entidad asociada"
              options={ENTITY_OPTIONS}
              error={
                errors.entityId?.message
              }
            />
          )}
        />
        <div className="md:col-span-2 xl:col-span-3">
          <Input
            label="Institución, área o instancia"
            maxLength={150}
            {...register("instance")}
            error={
              errors.instance?.message
            }
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
    <SectionCard
      title="Clasificación y asignación"
      icon={
        <ClipboardCheck className="h-4 w-4" />
      }
    >
      <div className="grid gap-x-3.5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <Controller
          control={control}
          name="statusId"
          render={({ field }) => (
            <SelectField
              label="Estatus"
              value={field.value}
              onValueChange={
                field.onChange
              }
              placeholder="Sin clasificación"
              options={STATUS_OPTIONS}
              error={
                errors.statusId?.message
              }
            />
          )}
        />
        <Controller
          control={control}
          name="caseTypeId"
          render={({ field }) => (
            <SelectField
              label="Tipo de caso"
              value={field.value}
              onValueChange={
                field.onChange
              }
              placeholder="Sin clasificación"
              options={
                CASE_TYPE_OPTIONS
              }
              error={
                errors.caseTypeId?.message
              }
            />
          )}
        />
        <Controller
          control={control}
          name="registryTypeId"
          render={({ field }) => (
            <SelectField
              label="Tipo de registro"
              value={field.value}
              onValueChange={
                field.onChange
              }
              placeholder="Sin clasificación"
              options={
                REGISTRY_TYPE_OPTIONS
              }
              error={
                errors.registryTypeId
                  ?.message
              }
            />
          )}
        />
      </div>

      <div className="mt-4 border-t border-[var(--ui-border)] pt-4">
        <SystemAssignmentSummary
          userName={userName}
        />
      </div>
    </SectionCard>
  );
}

export function AttentionObservationsSection({
  register,
  errors,
  canUploadFiles,
  files,
  onFilesChange,
}: FormFieldsProps & {
  canUploadFiles: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  return (
    <SectionCard
      title="Observaciones y archivos"
      icon={
        <FileText className="h-4 w-4" />
      }
    >
      <Textarea
        label="Observaciones"
        {...register("observations")}
        error={
          errors.observations?.message
        }
        className="min-h-28"
        placeholder="Descripción, solución o notas de la atención..."
      />

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-slate-600">
          Archivos adjuntos
        </p>

        {canUploadFiles ? (
          <FileDropzone
            files={files}
            onFilesChange={onFilesChange}
            accept={
              ATTENTION_ATTACHMENT_ACCEPT
            }
            helperText="PDF, DOCX, XLSX, CSV, MSG o EML · máximo 20 MB por archivo"
            validateFile={
              validateAttentionAttachment
            }
            onValidationError={(
              message,
            ) =>
              toast.error(
                "Archivo no válido",
                {
                  description: message,
                },
              )
            }
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            Su cuenta no tiene la acción
            SUBIR_ARCHIVO_BITACORA. Puede
            registrar la atención sin
            adjuntos.
          </div>
        )}
      </div>
    </SectionCard>
  );
}
