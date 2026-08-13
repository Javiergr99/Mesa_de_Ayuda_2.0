import { useState } from "react";
import { FileText, Mail, Save, ShieldAlert, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAttentionFiles,
  useDeleteAttention,
  useReplaceAttentionFile,
  useUpdateAttention,
} from "@/features/attentions/api/attentions.queries";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import { ATTENTION_STATUS_CATALOG } from "@/features/attentions/model/attention.catalogs";
import type { Attention } from "@/features/attentions/model/attention.types";
import { sessionHasExactAction } from "@/features/auth/services/jwt-actions";
import { useAuthStore } from "@/features/auth/model/auth.store";
import {
  ATTENTION_ATTACHMENT_ACCEPT,
  validateAttentionAttachment,
} from "@/shared/files/attention-attachment.rules";
import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";

function ReadonlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

export function TrackingDrawer({
  attention,
  open,
  onOpenChange,
}: {
  attention: Attention | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!attention) return null;

  return (
    <TrackingDrawerEditor
      key={`${attention.id}-${attention.updatedAt}`}
      attention={attention}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function TrackingDrawerEditor({
  attention,
  open,
  onOpenChange,
}: {
  attention: Attention;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const user = useAuthStore((state) => state.user);
  const canUpdate = sessionHasExactAction(user, MESA_AYUDA_ACTIONS.updateLog);
  const updateMutation = useUpdateAttention();
  const deleteMutation = useDeleteAttention();
  const replaceFileMutation = useReplaceAttentionFile();
  const filesQuery = useAttentionFiles(open ? attention.id : null);
  const canManageFiles = sessionHasExactAction(user, MESA_AYUDA_ACTIONS.uploadLogFile);
  const canDelete = sessionHasExactAction(user, MESA_AYUDA_ACTIONS.deleteLog);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusId, setStatusId] = useState(attention.statusId ? String(attention.statusId) : "");
  const [instance, setInstance] = useState(attention.instance === "—" ? "" : attention.instance);
  const [email, setEmail] = useState(attention.email === "—" ? "" : attention.email);
  const [phone, setPhone] = useState(attention.phone === "—" ? "" : attention.phone);
  const [description, setDescription] = useState(
    attention.description === "Sin observaciones registradas." ? "" : attention.description,
  );

  async function handleSave() {
    const payload: {
      estatus_id?: number | null;
      instancia?: string | null;
      correo?: string | null;
      telefono?: string | null;
      observaciones?: string | null;
    } = {};

    const nextStatusId = statusId ? Number(statusId) : null;
    if (nextStatusId !== attention.statusId) payload.estatus_id = nextStatusId;
    if (instance !== (attention.instance === "—" ? "" : attention.instance)) payload.instancia = instance || null;
    if (email !== (attention.email === "—" ? "" : attention.email)) payload.correo = email || null;
    if (phone !== (attention.phone === "—" ? "" : attention.phone)) payload.telefono = phone || null;
    if (description !== (attention.description === "Sin observaciones registradas." ? "" : attention.description)) {
      payload.observaciones = description || null;
    }

    if (!Object.keys(payload).length) {
      toast.info("No hay cambios para guardar");
      return;
    }

    try {
      const updated = await updateMutation.mutateAsync({ id: attention.id, payload });
      toast.success("Información actualizada correctamente", {
        description: `La atención ${updated.reference} fue actualizada mediante PATCH.`,
      });
    } catch (error) {
      toast.error("No fue posible actualizar la atención", {
        description: error instanceof Error ? error.message : "La API rechazó la actualización.",
      });
    }
  }

  const summary = (
    <div className="space-y-5 p-6">
      {!canUpdate ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Su cuenta puede consultar la bitácora, pero no tiene la acción ACTUALIZAR_BITACORA.</p>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900">Seguimiento operativo</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Estatus"
            value={statusId}
            onValueChange={setStatusId}
            disabled={!canUpdate}
            placeholder="Sin estatus"
            options={ATTENTION_STATUS_CATALOG.map((item) => ({
              label: item.label,
              value: String(item.id),
            }))}
          />
          <Input label="Instancia" value={instance} onChange={(event) => setInstance(event.target.value)} disabled={!canUpdate} />
          <Input label="Correo" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!canUpdate} />
          <Input label="Teléfono" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={!canUpdate} />
        </div>
        <div className="mt-4">
          <Textarea
            label="Observaciones"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={!canUpdate}
            className="min-h-28"
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2">
          <UserRound className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900">Datos del registro</h3>
          <Badge tone="blue">Solo lectura</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ReadonlyValue label="Solicitante" value={attention.requester} />
          <ReadonlyValue label="Tipo de caso" value={attention.caseType} />
          <ReadonlyValue label="Tipo de registro" value={attention.registry} />
          <ReadonlyValue label="Entidad" value={attention.entity} />
          <ReadonlyValue label="Fecha" value={attention.date} />
          <ReadonlyValue label="Hora" value={attention.time} />
          <ReadonlyValue label="Creado por" value={attention.createdBy} />
          <ReadonlyValue label="Atendido por" value={attention.attendedBy} />
        </div>
      </section>
    </div>
  );

  const files = (
    <div className="space-y-3 p-6">
      {filesQuery.isPending ? (
        <p className="text-sm text-slate-500">Consultando archivos activos…</p>
      ) : filesQuery.error ? (
        <p className="text-sm text-red-600">
          {filesQuery.error instanceof Error ? filesQuery.error.message : "No fue posible consultar los archivos."}
        </p>
      ) : filesQuery.data?.length ? (
        filesQuery.data.map((file) => (
          <div key={file.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
              {file.isEmail ? <Mail className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">{file.size} · {file.date}</p>
            </div>
            {canManageFiles ? (
              <label className="focus-ring cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                Reemplazar
                <input
                  type="file"
                  accept={ATTENTION_ATTACHMENT_ACCEPT}
                  className="sr-only"
                  disabled={replaceFileMutation.isPending}
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0];
                    event.currentTarget.value = "";
                    if (!nextFile) return;
                    const validation = validateAttentionAttachment(nextFile);
                    if (!validation.valid) {
                      toast.error("Archivo no válido", { description: validation.message });
                      return;
                    }
                    void replaceFileMutation
                      .mutateAsync({ id: attention.id, fileId: file.id, file: nextFile })
                      .then(() => toast.success("Archivo reemplazado correctamente"))
                      .catch((error: unknown) =>
                        toast.error("No fue posible reemplazar el archivo", {
                          description: error instanceof Error ? error.message : "La API rechazó el archivo.",
                        }),
                      );
                  }}
                />
              </label>
            ) : (
              <Badge tone="slate">Sin descarga API</Badge>
            )}
          </div>
        ))
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No hay archivos activos relacionados con esta atención.
        </div>
      )}
    </div>
  );

  return (
    <>
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={`${attention.reference} · ${attention.caseType}`}
      description={`${attention.createdAt} · ${attention.instance}`}
      widthClassName="w-[760px] max-w-[92vw]"
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            La API registra auditoría de las actualizaciones automáticamente.
          </p>
          <div className="flex gap-2">
            {canDelete ? (
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cerrar</Button>
            {canUpdate ? (
              <Button onClick={() => void handleSave()} disabled={updateMutation.isPending}>
                <Save className="h-4 w-4" />
                {updateMutation.isPending ? "Guardando cambios..." : "Guardar actualización"}
              </Button>
            ) : null}
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-3">
        <StatusBadge status={attention.status} />
        <Badge tone="blue">{attention.registry}</Badge>
      </div>
      <Tabs
        defaultValue="summary"
        tabs={[
          { value: "summary", label: "Resumen", content: summary },
          { value: "files", label: "Archivos", content: files },
        ]}
      />
    </Drawer>
    <Dialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      title="Eliminar bitácora"
      description="La eliminación es lógica: la atención dejará de mostrarse y sus archivos activos se ocultarán, pero no se borrarán físicamente."
      footer={
        <>
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
          <Button
            variant="danger"
            disabled={deleteMutation.isPending}
            onClick={() => {
              void deleteMutation
                .mutateAsync(attention.id)
                .then(() => {
                  toast.success("Bitácora eliminada lógicamente");
                  setDeleteOpen(false);
                  onOpenChange(false);
                })
                .catch((error: unknown) =>
                  toast.error("No fue posible eliminar la bitácora", {
                    description: error instanceof Error ? error.message : "La API rechazó la eliminación.",
                  }),
                );
            }}
          >
            <Trash2 className="h-4 w-4" />
            {deleteMutation.isPending ? "Eliminando..." : "Confirmar eliminación"}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-slate-600">
        Esta acción utiliza DELETE /api/v1/bitacoras/{"{bitacora_id}"} y requiere ELIMINAR_BITACORA.
      </p>
    </Dialog>
    </>
  );
}
