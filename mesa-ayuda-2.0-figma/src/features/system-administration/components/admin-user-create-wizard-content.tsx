import { CheckCircle2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { SelectOption } from "@/components/ui/select-field";
import { AdminUserCreateStepper } from "@/features/system-administration/components/admin-user-create-stepper";
import {
  AdminUserIdentityStep,
  AdminUserPermissionsStep,
  AdminUserReviewStep,
  AdminUserScopeStep,
} from "@/features/system-administration/components/admin-user-create-steps";
import { AdminWizardFooter } from "@/features/system-administration/components/admin-wizard-footer";
import type { CreateUserWizardValues } from "@/features/system-administration/model/admin-user-create-wizard";
import type {
  PermissionCatalogGroup,
  PermissionSelection,
} from "@/features/system-administration/model/admin-user.types";


export type AdminUserCreateWizardContentProps = {
  step: number;
  form: UseFormReturn<CreateUserWizardValues>;
  catalog: PermissionCatalogGroup[];
  selectedCatalog: PermissionCatalogGroup[];
  selection: PermissionSelection;
  permissionSearch: string;
  lockedActionIds: Set<string>;
  entityLabel: string;
  instanceLabel: string;
  entityOptions: SelectOption[];
  instanceOptions: SelectOption[];
  stepError: string;
  confirmed: boolean;
  isLoading: boolean;
  isPending: boolean;
  onSelectionChange: (
    next: PermissionSelection,
  ) => void;
  onPermissionSearchChange: (
    value: string,
  ) => void;
  onConfirmedChange: (
    value: boolean,
  ) => void;
  onSelectedGroupIdsChange: (
    groupIds: string[],
  ) => void;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
};

export function AdminUserCreateWizardContent({
  step,
  form,
  catalog,
  selectedCatalog,
  selection,
  permissionSearch,
  lockedActionIds,
  entityLabel,
  instanceLabel,
  entityOptions,
  instanceOptions,
  stepError,
  confirmed,
  isLoading,
  isPending,
  onSelectionChange,
  onPermissionSearchChange,
  onConfirmedChange,
  onSelectedGroupIdsChange,
  onCancel,
  onPrevious,
  onNext,
  onSubmit,
}: AdminUserCreateWizardContentProps) {
  return (
    <>
      <AdminUserCreateStepper
        currentStep={step}
      />

      {step === 3 ? (
        <AdminUserPermissionsStep
          catalog={selectedCatalog}
          selection={selection}
          onSelectionChange={
            onSelectionChange
          }
          search={permissionSearch}
          onSearchChange={
            onPermissionSearchChange
          }
          lockedActionIds={
            lockedActionIds
          }
          entityLabel={entityLabel}
          instanceLabel={instanceLabel}
        />
      ) : step === 4 ? (
        <AdminUserReviewStep
          values={form.getValues()}
          catalog={catalog}
          selection={selection}
          entityLabel={entityLabel}
          instanceLabel={instanceLabel}
          confirmed={confirmed}
          onConfirmedChange={
            onConfirmedChange
          }
        />
      ) : (
        <section className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-sm">
          {step === 1 ? (
            <AdminUserIdentityStep
              register={form.register}
              control={form.control}
              errors={
                form.formState.errors
              }
              entityOptions={
                entityOptions
              }
              instanceOptions={
                instanceOptions
              }
            />
          ) : (
            <AdminUserScopeStep
              control={form.control}
              errors={
                form.formState.errors
              }
              catalog={catalog}
              selectedGroupIds={
                selection.groupIds
              }
              onSelectedGroupIdsChange={
                onSelectedGroupIdsChange
              }
              entityLabel={entityLabel}
              instanceLabel={
                instanceLabel
              }
            />
          )}

          {stepError ? (
            <WizardError
              message={stepError}
              placement="bottom"
            />
          ) : null}

          <AdminWizardFooter
            onCancel={onCancel}
            onPrevious={
              step > 1
                ? onPrevious
                : undefined
            }
            onNext={onNext}
            nextDisabled={isLoading}
          />
        </section>
      )}

      {step >= 3 ? (
        <div className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-sm">
          {stepError ? (
            <WizardError
              message={stepError}
              placement="top"
            />
          ) : null}

          <AdminWizardFooter
            onCancel={onCancel}
            onPrevious={onPrevious}
            onNext={
              step === 4
                ? onSubmit
                : onNext
            }
            nextLabel={
              step === 4
                ? isPending
                  ? "Registrando..."
                  : "Registrar usuario"
                : "Siguiente"
            }
            nextDisabled={
              isPending ||
              (step === 4 && !confirmed)
            }
            nextIcon={
              step === 4 ? (
                <CheckCircle2
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              ) : undefined
            }
          />
        </div>
      ) : null}
    </>
  );
}

function WizardError({
  message,
  placement,
}: {
  message: string;
  placement: "top" | "bottom";
}) {
  return (
    <div
      className={
        placement === "top"
          ? "mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          : "mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      }
    >
      {message}
    </div>
  );
}
