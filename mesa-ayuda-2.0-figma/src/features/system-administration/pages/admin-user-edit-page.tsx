import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { AdminUserStatusBadge } from "@/features/system-administration/components/admin-user-status-badge";
import { getAdminErrorMessage } from "@/features/system-administration/api/admin-api-error";
import {
  useAdminCurrentUser,
  useAdminUser,
  useAdminUsers,
  useAdminUserStatusMutation,
  useUpdateAdminUser,
} from "@/features/system-administration/hooks/admin-users.hooks";
import { hasAdminAction, isSuperAdmin } from "@/features/system-administration/model/admin-authorization";
import {
  updateAdminUserSchema,
  type UpdateAdminUserFormValues,
} from "@/features/system-administration/model/admin-user.schema";
import {
  ADMIN_STATUS_CATALOG,
  type AdminUserFilters,
  type UpdateAdminUserInput,
} from "@/features/system-administration/model/admin-user.types";
import { FEDERAL_ENTITY_CATALOG } from "@/shared/catalogs/federal-entities";

const ADMIN_USER_SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "short",
});

const userOptionsFilters: AdminUserFilters = {
  search: "",
  status: "",
  instanceId: "",
  entityId: "",
  groupId: "",
  page: 1,
  pageSize: 100,
};

function formatDate(value?: string): string {
  if (!value) return "No disponible";
  return ADMIN_USER_SHORT_DATE_FORMATTER.format(new Date(value));
}

function InfoValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[var(--ui-text-secondary)]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--ui-text-primary)]">{value}</dd>
    </div>
  );
}

export function AdminUserEditPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUserQuery = useAdminCurrentUser();
  const userQuery = useAdminUser(userId ?? null);
  const usersQuery = useAdminUsers(userOptionsFilters, currentUserQuery.isSuccess);
  const updateMutation = useUpdateAdminUser();
  const statusMutation = useAdminUserStatusMutation();
  const [statusId, setStatusId] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const form = useForm<UpdateAdminUserFormValues>({
    resolver: zodResolver(updateAdminUserSchema),
  });

  const user = userQuery.data;
  const actor = currentUserQuery.data;
  const canEdit = hasAdminAction(actor, "ACTUALIZAR_USUARIO");
  const protectedTarget = isSuperAdmin(user);

  useEffect(() => {
    if (!user) return;
    form.reset({
      firstName: user.firstName,
      firstSurname: user.firstSurname,
      secondSurname: user.secondSurname ?? "",
      curp: user.curp,
      email: user.email,
      phone: user.phone ?? "",
      instanceId: user.instanceId ? String(user.instanceId) : "",
      entityId: user.entityId ? String(user.entityId) : "",
    });
    setStatusId(user.statusId ? String(user.statusId) : "");
    setReason("");
    setReasonError("");
  }, [form, user]);

  const entityOptions = useMemo(
    () => FEDERAL_ENTITY_CATALOG.map((entity) => ({ value: String(entity.id), label: entity.label })),
    [],
  );

  const instanceOptions = useMemo(() => {
    const options = usersQuery.data?.filterOptions.instances ?? [];
    if (user?.instanceId && !options.some((item) => item.value === String(user.instanceId))) {
      return [{ value: String(user.instanceId), label: user.instance }, ...options];
    }
    return options;
  }, [user, usersQuery.data?.filterOptions.instances]);

  const submit = form.handleSubmit(async (values) => {
    if (!user || !userId || !canEdit || protectedTarget) return;

    const dirty = form.formState.dirtyFields;
    const statusChanged = statusId !== String(user.statusId ?? "");
    const hasFieldChanges = Object.keys(dirty).length > 0;

    if (!hasFieldChanges && !statusChanged) {
      toast.info("No hay cambios pendientes.");
      return;
    }

    if (!reason.trim()) {
      setReasonError("Describe brevemente el motivo de la modificación.");
      return;
    }
    setReasonError("");

    const input: UpdateAdminUserInput = {
      ...(dirty.firstName ? { firstName: values.firstName } : {}),
      ...(dirty.firstSurname ? { firstSurname: values.firstSurname } : {}),
      ...(dirty.secondSurname ? { secondSurname: values.secondSurname || null } : {}),
      ...(dirty.curp ? { curp: values.curp } : {}),
      ...(dirty.email ? { email: values.email } : {}),
      ...(dirty.phone ? { phone: values.phone || null } : {}),
      ...(dirty.instanceId ? { instanceId: values.instanceId ? Number(values.instanceId) : null } : {}),
      ...(dirty.entityId ? { entityId: values.entityId ? Number(values.entityId) : null } : {}),
    };

    try {
      if (Object.keys(input).length) {
        await updateMutation.mutateAsync({ id: userId, input });
      }
      if (statusChanged && statusId) {
        await statusMutation.mutateAsync({ id: userId, statusId: Number(statusId) });
      }
      toast.success("Usuario actualizado correctamente.");
      navigate(`/app/usuarios?user=${encodeURIComponent(userId)}`);
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "No fue posible actualizar al usuario."));
    }
  });

  if (userQuery.isLoading || currentUserQuery.isLoading) {
    return <div className="rounded-xl border border-[var(--ui-border)] bg-white p-8 text-sm text-slate-500">Cargando usuario...</div>;
  }

  if (!user || !userId) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">No fue posible cargar el usuario solicitado.</div>;
  }

  if (!canEdit || protectedTarget) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
        No cuentas con permisos suficientes para editar este usuario.
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.firstSurname.charAt(0)}`.toUpperCase();
  const busy = updateMutation.isPending || statusMutation.isPending;

  return (
    <form onSubmit={submit} className="app-page">
      <PageHeading
        eyebrow={
          <span>
            Inicio &gt; Administración del sistema &gt; Usuarios &gt;{" "}
            <span className="text-[var(--ui-primary)]">Editar usuario</span>
          </span>
        }
        title="Editar usuario"
        description="Modifica los datos administrativos del usuario."
      />

      <section className="flex items-center gap-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-5 py-4 shadow-sm">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xs font-bold text-[var(--ui-primary)]">{initials}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-bold text-[var(--ui-text-primary)]">{user.fullName}</h2>
            <AdminUserStatusBadge status={user.status} />
          </div>
          <p className="mt-0.5 text-xs text-[var(--ui-text-secondary)]">CURP: {user.curp}</p>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-6 py-6 shadow-sm">
        <h2 className="text-base font-bold text-[var(--ui-text-primary)]">Datos generales</h2>
        <div className="mt-5 grid grid-cols-3 gap-x-5 gap-y-5">
          <Input id="edit-first-name-page" label="Nombre(s) *" {...form.register("firstName")} error={form.formState.errors.firstName?.message} />
          <Input id="edit-first-surname-page" label="Primer apellido *" {...form.register("firstSurname")} error={form.formState.errors.firstSurname?.message} />
          <Input id="edit-second-surname-page" label="Segundo apellido" {...form.register("secondSurname")} error={form.formState.errors.secondSurname?.message} />

          <Input id="edit-email-page" type="email" label="Correo electrónico institucional *" {...form.register("email")} error={form.formState.errors.email?.message} />
          <Input id="edit-phone-page" label="Teléfono de contacto" {...form.register("phone")} error={form.formState.errors.phone?.message} />
          <Input id="edit-curp-page" label="CURP *" maxLength={18} className="uppercase" {...form.register("curp", { onChange: (event) => { event.target.value = event.target.value.toUpperCase(); } })} error={form.formState.errors.curp?.message} />

          <div className="col-span-3 grid grid-cols-2 gap-5 pt-5">
            <SelectField
              label="Entidad federativa *"
              value={form.watch("entityId") ?? ""}
              onValueChange={(value) => form.setValue("entityId", value, { shouldDirty: true, shouldValidate: true })}
              options={entityOptions}
              error={form.formState.errors.entityId?.message}
            />
            <SelectField
              label="Instancia *"
              value={form.watch("instanceId") ?? ""}
              onValueChange={(value) => form.setValue("instanceId", value, { shouldDirty: true, shouldValidate: true })}
              options={instanceOptions}
              error={form.formState.errors.instanceId?.message}
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Estatus del usuario *"
              value={statusId}
              onValueChange={setStatusId}
              options={ADMIN_STATUS_CATALOG.map((item) => ({ value: String(item.id), label: item.name }))}
            />
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Cambiar el estatus del usuario puede afectar su acceso al sistema y revocar sesiones activas según las reglas de auth_service.</p>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--ui-border)] bg-slate-50 px-6 py-5">
        <h2 className="text-sm font-bold text-[var(--ui-text-primary)]">Información no editable</h2>
        <dl className="mt-4 grid grid-cols-4 gap-6">
          <InfoValue label="ID de usuario" value={user.id} />
          <InfoValue label="CURP actual" value={user.curp} />
          <InfoValue label="Fecha de registro" value={formatDate(user.createdAt)} />
          <InfoValue label="Última actualización" value={formatDate(user.updatedAt)} />
        </dl>
      </section>

      <section>
        <div className="mb-3 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Los cambios administrativos sensibles deben revisarse antes de guardar. El contrato vigente de auth_service no publica un campo para persistir el motivo.</p>
        </div>
        <Textarea
          id="edit-reason"
          label="Motivo del cambio *"
          placeholder="Describe brevemente el motivo de esta modificación..."
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            if (event.target.value.trim()) setReasonError("");
          }}
          error={reasonError}
          hint="Este texto funciona como confirmación administrativa en la interfaz y no se envía al backend actual."
        />
      </section>

      <div className="flex items-center justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-5 py-4 shadow-sm">
        <Button variant="secondary" onClick={() => navigate(`/app/usuarios?user=${encodeURIComponent(user.id)}`)}>Cancelar</Button>
        <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar cambios"}</Button>
      </div>
    </form>
  );
}
