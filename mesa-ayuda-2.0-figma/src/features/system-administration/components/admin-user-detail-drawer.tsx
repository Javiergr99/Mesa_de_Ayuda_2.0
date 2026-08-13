import { Clock3, KeyRound, LockKeyholeOpen, MailCheck, Pencil, RotateCcwKey, ShieldCheck, UserCog } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { SelectField } from "@/components/ui/select-field";
import { Tabs } from "@/components/ui/tabs";
import { getAdminErrorMessage } from "@/features/system-administration/api/admin-api-error";
import { AdminUserPermissionsDialog } from "@/features/system-administration/components/admin-user-permissions-dialog";
import { AdminUserStatusBadge } from "@/features/system-administration/components/admin-user-status-badge";
import {
  useAdminCurrentUser,
  useAdminUser,
  useAdminUserStatusMutation,
  usePasswordRecoveryMutation,
  useResendActivationMutation,
} from "@/features/system-administration/hooks/admin-users.hooks";
import { hasAdminAction, isSuperAdmin } from "@/features/system-administration/model/admin-authorization";
import { ADMIN_STATUS_CATALOG } from "@/features/system-administration/model/admin-user.types";

const ADMIN_USER_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

function Value({ label, value }: { label: string; value?: string | null }) {
  return <div><dt className="text-xs font-semibold text-[var(--ui-text-secondary)]">{label}</dt><dd className="mt-1 text-sm text-[var(--ui-text-primary)]">{value || "No disponible"}</dd></div>;
}

function formatDate(value?: string | null): string {
  return value
    ? ADMIN_USER_DATE_TIME_FORMATTER.format(new Date(value))
    : "No disponible";
}

export function AdminUserDetailDrawer({ userId, onOpenChange }: { userId: string | null; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const query = useAdminUser(userId);
  const currentUserQuery = useAdminCurrentUser();
  const statusMutation = useAdminUserStatusMutation();
  const resend = useResendActivationMutation();
  const recovery = usePasswordRecoveryMutation();
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [nextStatusId, setNextStatusId] = useState("1");
  const user = query.data;
  const actor = currentUserQuery.data;
  const targetIsSuperAdmin = isSuperAdmin(user);
  const canEdit = hasAdminAction(actor, "ACTUALIZAR_USUARIO") && !targetIsSuperAdmin;
  const canManagePermissions = !targetIsSuperAdmin && [
    "ASIGNAR_GRUPOS_USUARIO",
    "ASIGNAR_MODULOS_USUARIO",
    "ASIGNAR_ACCIONES_USUARIO",
    "QUITAR_GRUPOS_USUARIO",
    "QUITAR_MODULOS_USUARIO",
    "QUITAR_ACCIONES_USUARIO",
  ].some((action) => hasAdminAction(actor, action));

  const executeStatus = async () => {
    if (!user) return;
    try {
      await statusMutation.mutateAsync({ id: user.id, statusId: Number(nextStatusId) });
      toast.success("Estatus actualizado. auth_service revocó las sesiones cuando existió un cambio efectivo.");
    } catch (error) {
      toast.error(getAdminErrorMessage(error, "No fue posible cambiar el estatus."));
    }
  };

  const executeEmail = async (operation: "activation" | "recovery") => {
    if (!user) return;
    try {
      const result = operation === "activation"
        ? await resend.mutateAsync(user.id)
        : await recovery.mutateAsync(user.id);
      toast.success(result.message);
    } catch (error) {
      toast.error(getAdminErrorMessage(error));
    }
  };

  return (
    <>
      <Drawer
        open={Boolean(userId)}
        onOpenChange={onOpenChange}
        title={user?.fullName ?? "Detalle del usuario"}
        description={user ? `${user.curp} · ${user.email}` : "Cargando información..."}
        widthClassName="w-[760px] max-w-[94vw]"
        footer={user ? (
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cerrar</Button>
            {canEdit ? (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/app/usuarios/${encodeURIComponent(user.id)}/editar`);
                }}
              >
                <Pencil className="h-4 w-4" /> Editar usuario
              </Button>
            ) : null}
          </div>
        ) : null}
      >
        {query.isLoading ? <div className="p-6 text-sm text-slate-500">Cargando detalle...</div> : user ? (
          <Tabs
            defaultValue="summary"
            tabs={[
              {
                value: "summary",
                label: "Resumen",
                content: (
                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div><p className="text-lg font-bold text-[var(--ui-text-primary)]">{user.fullName}</p><p className="mt-1 text-sm text-[var(--ui-text-secondary)]">ID: {user.username}</p></div>
                      <AdminUserStatusBadge status={user.status} />
                    </div>
                    {targetIsSuperAdmin ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                        Este usuario tiene la acción SUPER_ADMIN. La edición de permisos y el cambio de estatus permanecen bloqueados hasta que backend implemente la protección del último SUPER_ADMIN y el auto-retiro.
                      </div>
                    ) : null}
                    <dl className="grid gap-5 rounded-xl border border-[var(--ui-border)] p-5 sm:grid-cols-2">
                      <Value label="CURP" value={user.curp} />
                      <Value label="Correo" value={user.email} />
                      <Value label="Teléfono" value={user.phone} />
                      <Value label="Entidad federativa" value={user.entity} />
                      <Value label="Instancia" value={user.instance} />
                      <Value label="Correo verificado" value={formatDate(user.emailVerifiedAt)} />
                      <Value label="Fecha de creación" value={formatDate(user.createdAt)} />
                      <Value label="Última actualización" value={formatDate(user.updatedAt)} />
                    </dl>
                  </div>
                ),
              },
              {
                value: "permissions",
                label: "Accesos y permisos",
                content: (
                  <div className="space-y-6 p-6">
                    {user.permissionGroups.length ? user.permissionGroups.map((group) => (
                      <section key={group.id} className="rounded-xl border border-[var(--ui-border)] p-4">
                        <h3 className="text-sm font-bold text-[var(--ui-text-primary)]">{group.name}</h3>
                        <div className="mt-3 space-y-3">
                          {group.modules.map((module) => (
                            <div key={module.id} className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs font-semibold text-[var(--ui-text-primary)]">{module.name}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {module.actions.map((action) => <span key={action.id} className="rounded-md bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700">{action.name}</span>)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )) : <p className="text-sm text-[var(--ui-text-secondary)]">El usuario no tiene permisos jerárquicos asignados.</p>}
                    {canManagePermissions ? <Button onClick={() => setPermissionsOpen(true)}><UserCog className="h-4 w-4" /> Administrar permisos</Button> : null}
                  </div>
                ),
              },
              {
                value: "security",
                label: "Seguridad",
                content: (
                  <div className="space-y-5 p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <SecurityItem label="Autenticación 2FA" value={user.twoFactorEnabled ? "Configurada" : "Pendiente"} icon={ShieldCheck} />
                      <SecurityItem label="Intentos de login" value={String(user.loginAttempts ?? 0)} icon={KeyRound} />
                    </div>
                    <div className="rounded-xl border border-[var(--ui-border)] p-4">
                      <p className="text-sm font-bold text-[var(--ui-text-primary)]">Correos administrativos</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--ui-text-secondary)]">Reenviar activación aplica a usuarios sin contraseña. Recuperación aplica a usuarios que ya tienen contraseña; auth_service validará la condición.</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Button variant="secondary" onClick={() => executeEmail("activation")} disabled={!canEdit || resend.isPending}><MailCheck className="h-4 w-4" /> Reenviar activación</Button>
                        <Button variant="secondary" onClick={() => executeEmail("recovery")} disabled={!canEdit || recovery.isPending}><RotateCcwKey className="h-4 w-4" /> Recuperar contraseña</Button>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--ui-border)] p-4">
                      <p className="text-sm font-bold text-[var(--ui-text-primary)]">Cambiar estatus</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--ui-text-secondary)]">La ruta vigente no recibe motivo. Todo cambio efectivo incrementa token_version, revoca sesiones y envía correo.</p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1"><SelectField label="Nuevo estatus" value={nextStatusId} onValueChange={setNextStatusId} options={ADMIN_STATUS_CATALOG.map((item) => ({ value: String(item.id), label: `${item.id} — ${item.name}` }))} disabled={!canEdit} /></div>
                        <Button onClick={executeStatus} disabled={!canEdit || statusMutation.isPending}>Aplicar estatus</Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button variant="secondary" disabled title="Pendiente de auth_service"><ShieldCheck className="h-4 w-4" /> Restablecer 2FA</Button>
                      <Button variant="secondary" disabled title="Pendiente de auth_service"><LockKeyholeOpen className="h-4 w-4" /> Desbloqueo especializado</Button>
                    </div>
                  </div>
                ),
              },
              {
                value: "activity",
                label: "Actividad",
                content: (
                  <div className="p-6">
                    <div className="rounded-xl border border-dashed border-[var(--ui-border)] p-8 text-center">
                      <Clock3 className="mx-auto h-6 w-6 text-[var(--ui-primary)]" />
                      <p className="mt-3 text-sm font-bold text-[var(--ui-text-primary)]">Historial pendiente de backend</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--ui-text-secondary)]">auth_service v1.0 no publica una ruta de auditoría administrativa. No se mostrarán registros ficticios.</p>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        ) : <div className="p-6 text-sm text-red-600">No se pudo cargar el usuario.</div>}
      </Drawer>
      {user ? <AdminUserPermissionsDialog open={permissionsOpen} onOpenChange={setPermissionsOpen} user={user} /> : null}
    </>
  );
}

function SecurityItem({ label, value, icon: Icon }: { label: string; value: string; icon: typeof KeyRound }) {
  return <div className="flex gap-3 rounded-xl border border-[var(--ui-border)] p-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-4 w-4" /></span><div><p className="text-xs font-semibold text-[var(--ui-text-secondary)]">{label}</p><p className="mt-1 text-sm font-bold text-[var(--ui-text-primary)]">{value}</p></div></div>;
}
