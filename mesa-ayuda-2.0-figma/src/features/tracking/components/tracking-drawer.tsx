import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Tabs } from "@/components/ui/tabs";
import { useUpdateAttention } from "@/features/attentions/api/attentions.queries";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import { ATTENTION_STATUS_CATALOG } from "@/features/attentions/model/attention.catalogs";
import type { Attention } from "@/features/attentions/model/attention.types";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { sessionHasExactAction } from "@/features/auth/services/jwt-actions";
import { TrackingDrawerFiles } from "@/features/tracking/components/tracking-drawer-files";
import { TrackingDrawerHistory } from "@/features/tracking/components/tracking-drawer-history";
import { TrackingDrawerSummary } from "@/features/tracking/components/tracking-drawer-summary";
import { MESA_AYUDA_ACTIONS } from "@/shared/permissions/mesa-ayuda-actions";

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
  const canManageFiles = sessionHasExactAction(
    user,
    MESA_AYUDA_ACTIONS.uploadLogFile,
  );
  const updateMutation = useUpdateAttention();

  const [statusId, setStatusId] = useState(
    attention.statusId ? String(attention.statusId) : "",
  );
  const [instance, setInstance] = useState(
    attention.instance === "—" ? "" : attention.instance,
  );
  const [email, setEmail] = useState(
    attention.email === "—" ? "" : attention.email,
  );
  const [phone, setPhone] = useState(
    attention.phone === "—" ? "" : attention.phone,
  );
  const [description, setDescription] = useState(
    attention.description === "Sin observaciones registradas."
      ? ""
      : attention.description,
  );

  const selectedStatus =
    ATTENTION_STATUS_CATALOG.find((item) => String(item.id) === statusId)
      ?.label ?? attention.status;

  async function handleSave() {
    const payload: {
      estatus_id?: number | null;
      instancia?: string | null;
      correo?: string | null;
      telefono?: string | null;
      observaciones?: string | null;
    } = {};

    const nextStatusId = statusId ? Number(statusId) : null;

    if (nextStatusId !== attention.statusId) {
      payload.estatus_id = nextStatusId;
    }

    if (instance !== (attention.instance === "—" ? "" : attention.instance)) {
      payload.instancia = instance || null;
    }

    if (email !== (attention.email === "—" ? "" : attention.email)) {
      payload.correo = email || null;
    }

    if (phone !== (attention.phone === "—" ? "" : attention.phone)) {
      payload.telefono = phone || null;
    }

    if (
      description !==
      (attention.description === "Sin observaciones registradas."
        ? ""
        : attention.description)
    ) {
      payload.observaciones = description || null;
    }

    if (!Object.keys(payload).length) {
      toast.info("No hay cambios para guardar");
      return;
    }

    try {
      const updated = await updateMutation.mutateAsync({
        id: attention.id,
        payload,
      });

      toast.success("Información actualizada correctamente", {
        description: `La atención ${updated.reference} fue actualizada.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast.error("No fue posible actualizar la atención", {
        description:
          error instanceof Error
            ? error.message
            : "La API rechazó la actualización.",
      });
    }
  }

  const summary = (
    <TrackingDrawerSummary
      attention={attention}
      canUpdate={canUpdate}
      statusId={statusId}
      onStatusIdChange={setStatusId}
      instance={instance}
      onInstanceChange={setInstance}
      email={email}
      onEmailChange={setEmail}
      phone={phone}
      onPhoneChange={setPhone}
      description={description}
      onDescriptionChange={setDescription}
    />
  );

  const history = <TrackingDrawerHistory attention={attention} />;

  const files = (
    <TrackingDrawerFiles
      attention={attention}
      canManageFiles={canManageFiles}
    />
  );

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Seguimiento de atención"
      description={`${attention.reference} · ${attention.caseType}`}
      widthClassName="w-[760px] max-w-[94vw]"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Los cambios se guardarán en el registro de la atención.
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            {canUpdate ? (
              <Button
                onClick={() => void handleSave()}
                disabled={updateMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {updateMutation.isPending
                  ? "Guardando..."
                  : "Guardar actualización"}
              </Button>
            ) : null}
          </div>
        </div>
      }
    >
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">
              {attention.reference}
            </p>
            <h2 className="mt-1 truncate text-xl font-bold text-slate-950">
              {attention.caseType}
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Fecha de registro: {attention.createdAt}
              <span className="px-2 text-slate-300">|</span>
              Última actualización: {attention.updatedAt}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge tone="blue">{attention.registry}</Badge>
            <StatusBadge status={selectedStatus as Attention["status"]} />
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="summary"
        tabs={[
          { value: "summary", label: "Resumen", content: summary },
          { value: "history", label: "Historial", content: history },
          { value: "files", label: "Archivos", content: files },
        ]}
      />
    </Drawer>
  );
}
