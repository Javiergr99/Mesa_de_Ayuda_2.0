import {
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { SearchField } from "@/components/ui/search-field";
import { getAdminErrorMessage } from "@/features/system-administration/api/admin-api-error";
import { PermissionTree } from "@/features/system-administration/components/permission-tree";
import {
  useAdminCurrentUser,
  usePermissionCatalog,
  useUpdatePermissionsMutation,
} from "@/features/system-administration/hooks/admin-users.hooks";
import { isSuperAdmin } from "@/features/system-administration/model/admin-authorization";
import { selectionFromUser } from "@/features/system-administration/model/admin-user.mapper";
import type {
  AdminUser,
  PermissionCatalogGroup,
  PermissionSelection,
} from "@/features/system-administration/model/admin-user.types";
import {
  buildPermissionOperationPlan,
  missingActionsForPermissionPlan,
  permissionOperationCount,
} from "@/features/system-administration/model/permission-operation-plan";
import { permissionSelectionEquals } from "@/features/system-administration/model/permission-selection";

const EMPTY_PERMISSION_CATALOG: PermissionCatalogGroup[] =
  [];
const EMPTY_ACTOR_PERMISSIONS: string[] = [];

type AdminUserPermissionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
};

/**
 * La sesión interna se remonta al abrir/cerrar el diálogo. Esto permite que
 * cada apertura parta del estado vigente del usuario sin copiar props a estado
 * mediante useEffect y, al mismo tiempo, evita sobrescribir cambios locales
 * mientras el diálogo permanece abierto.
 */
export function AdminUserPermissionsDialog(
  props: AdminUserPermissionsDialogProps,
) {
  const sessionKey = `${props.user.id}:${
    props.open ? "open" : "closed"
  }`;

  return (
    <AdminUserPermissionsDialogSession
      key={sessionKey}
      {...props}
    />
  );
}

function AdminUserPermissionsDialogSession({
  open,
  onOpenChange,
  user,
}: AdminUserPermissionsDialogProps) {
  const catalogQuery = usePermissionCatalog(open);
  const currentUserQuery = useAdminCurrentUser();
  const updateMutation =
    useUpdatePermissionsMutation();

  const [search, setSearch] = useState("");
  const [original, setOriginal] =
    useState<PermissionSelection>(() =>
      selectionFromUser(user),
    );
  const [selection, setSelection] =
    useState<PermissionSelection>(() =>
      selectionFromUser(user),
    );

  const catalog =
    catalogQuery.data ?? EMPTY_PERMISSION_CATALOG;

  const actorCanAssignSuperAdmin = isSuperAdmin(
    currentUserQuery.data,
  );

  const originalActionIds = useMemo(
    () => new Set(original.actionIds),
    [original.actionIds],
  );

  const lockedActionIds = useMemo(() => {
    const lockedIds = new Set<string>();

    for (const group of catalog) {
      for (const module of group.modules) {
        for (const action of module.actions) {
          if (
            action.name === "SUPER_ADMIN" &&
            (!actorCanAssignSuperAdmin ||
              originalActionIds.has(action.id))
          ) {
            lockedIds.add(action.id);
          }
        }
      }
    }

    return lockedIds;
  }, [
    actorCanAssignSuperAdmin,
    catalog,
    originalActionIds,
  ]);

  const plan = useMemo(
    () =>
      buildPermissionOperationPlan(
        original,
        selection,
        catalog,
      ),
    [catalog, original, selection],
  );

  const actorPermissions =
    currentUserQuery.data?.permissions ??
    EMPTY_ACTOR_PERMISSIONS;

  const missingActions = useMemo(
    () =>
      missingActionsForPermissionPlan(
        plan,
        actorPermissions,
      ),
    [actorPermissions, plan],
  );

  const changes = {
    added:
      plan.groupsToAdd.length +
      plan.modulesToAdd.length +
      plan.actionsToAdd.length,
    removed:
      plan.groupsToRemove.length +
      plan.modulesToRemove.length +
      plan.actionsToRemove.length,
    operations: permissionOperationCount(plan),
  };

  const save = async () => {
    if (
      permissionSelectionEquals(
        original,
        selection,
      )
    ) {
      toast.info("No hay cambios pendientes.");
      return;
    }

    try {
      const result =
        await updateMutation.mutateAsync({
          id: user.id,
          input: {
            original,
            next: selection,
            actorPermissions,
          },
        });

      if (!result.complete) {
        const actual = selectionFromUser(
          result.user,
        );

        setOriginal(actual);
        setSelection(actual);

        toast.warning(
          result.warning ??
            "La actualización fue parcial; se recargó el estado real del servidor.",
          { duration: 10000 },
        );
        return;
      }

      toast.success(
        `Permisos actualizados mediante ${result.completedOperations} operación(es) vigentes.`,
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(
        getAdminErrorMessage(
          error,
          "No fue posible actualizar los permisos.",
        ),
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Administrar permisos"
      description={`${user.fullName} · ${user.curp}`}
      widthClassName="max-w-5xl"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={save}
            disabled={
              updateMutation.isPending ||
              catalogQuery.isLoading ||
              permissionSelectionEquals(
                original,
                selection,
              ) ||
              missingActions.length > 0
            }
          >
            <ShieldCheck
              className="h-4 w-4"
              aria-hidden="true"
            />
            {updateMutation.isPending
              ? "Aplicando operaciones..."
              : "Guardar permisos"}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Buscar grupo, módulo o acción..."
          />

          <div className="mt-4 max-h-[52vh] overflow-y-auto pr-1 app-scrollbar">
            {catalogQuery.isLoading ? (
              <p className="p-6 text-sm text-slate-500">
                Cargando catálogo vigente...
              </p>
            ) : (
              <PermissionTree
                catalog={catalog}
                selection={selection}
                onSelectionChange={setSelection}
                search={search}
                lockedActionIds={lockedActionIds}
              />
            )}
          </div>
        </div>

        <aside className="space-y-5 rounded-xl border border-[var(--ui-border)] bg-slate-50 p-5">
          <div>
            <p className="text-sm font-bold text-[var(--ui-text-primary)]">
              Resumen de selección
            </p>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Summary
                value={selection.groupIds.length}
                label="Grupos"
              />
              <Summary
                value={selection.moduleIds.length}
                label="Módulos"
              />
              <Summary
                value={selection.actionIds.length}
                label="Acciones"
              />
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-3">
              <p className="text-lg font-bold text-emerald-700">
                +{changes.added}
              </p>
              <p className="text-[10px] font-semibold text-emerald-800">
                Por agregar
              </p>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 px-2 py-3">
              <p className="text-lg font-bold text-red-700">
                -{changes.removed}
              </p>
              <p className="text-[10px] font-semibold text-red-800">
                Por retirar
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle
                className="h-4 w-4"
                aria-hidden="true"
              />
              Operación no atómica
            </div>

            <p className="mt-1">
              auth_service v1.0 aplica POST y
              DELETE individuales. Si una petición
              falla, el proceso se detiene y se
              vuelve a consultar el estado real.
            </p>

            <p className="mt-2 font-semibold">
              Operaciones HTTP estimadas:{" "}
              {changes.operations}
            </p>
          </div>

          {missingActions.length ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">
              <p className="font-bold">
                No puedes aplicar esta combinación
                de cambios.
              </p>
              <p className="mt-1">
                Faltan estas acciones:{" "}
                {missingActions.join(", ")}.
              </p>
            </div>
          ) : null}

          <p className="text-xs leading-5 text-[var(--ui-text-secondary)]">
            Un SUPER_ADMIN autenticado puede
            asignar la acción SUPER_ADMIN. Cuando
            ya está asignada, permanece protegida
            contra retiro hasta que backend
            publique las salvaguardas del último
            superadministrador y auto-retiro.
          </p>
        </aside>
      </div>
    </Dialog>
  );
}

function Summary({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--ui-border)] bg-white px-2 py-3">
      <dd className="text-xl font-bold text-[var(--ui-primary)]">
        {value}
      </dd>
      <dt className="mt-1 text-[10px] font-semibold text-[var(--ui-text-secondary)]">
        {label}
      </dt>
    </div>
  );
}
