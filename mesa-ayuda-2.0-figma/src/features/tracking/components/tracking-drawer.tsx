import { useState } from "react";
import { CalendarClock, Download, FileText, History, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge, StatusBadge } from "@/features/attentions/components/attention-badges";
import { useUpdateAttention } from "@/features/attentions/api/attentions.queries";
import type { Attention, AttentionPriority, AttentionStatus } from "@/features/attentions/model/attention.types";

function ReadonlyValue({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-medium text-slate-800">{value || "—"}</p></div>;
}

export function TrackingDrawer({ attention, open, onOpenChange }: { attention: Attention | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!attention) return null;

  return (
    <TrackingDrawerEditor
      key={attention.id}
      attention={attention}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function TrackingDrawerEditor({ attention, open, onOpenChange }: { attention: Attention; open: boolean; onOpenChange: (open: boolean) => void }) {
  const updateMutation = useUpdateAttention();
  const [status, setStatus] = useState<AttentionStatus>(attention.status);
  const [priority, setPriority] = useState<AttentionPriority>(attention.priority);
  const [responsible, setResponsible] = useState(attention.responsible);
  const [description, setDescription] = useState(attention.description);
  const [updateDescription, setUpdateDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!updateDescription.trim()) {
      setError("Describa la actualización realizada antes de guardar.");
      return;
    }
    setError(null);
    try {
      const updated = await updateMutation.mutateAsync({ id: attention.id, status, priority, responsible, description, updateDescription });
      toast.success("Información actualizada correctamente", { description: `La atención ${updated.folio} ahora se encuentra ${updated.status}.` });
      setUpdateDescription("");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "No fue posible guardar los cambios.";
      toast.error("No fue posible actualizar la atención", { description: message });
    }
  }

  const summary = (
    <div className="space-y-5 p-6">
      <section className="rounded-xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2"><CalendarClock className="h-4 w-4 text-blue-600" /><h3 className="font-bold text-slate-900">Estado y gestión</h3></div>
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Estatus" value={status} onValueChange={(value) => setStatus(value as AttentionStatus)} options={["Pendiente", "En proceso", "En espera", "Finalizada", "Cancelada"].map((value) => ({ label: value, value }))} />
          <SelectField label="Prioridad" value={priority} onValueChange={(value) => setPriority(value as AttentionPriority)} options={["Baja", "Media", "Alta", "Urgente"].map((value) => ({ label: value, value }))} />
          <div className="col-span-2"><SelectField label="Responsable" value={responsible} onValueChange={setResponsible} options={["Alejandro Mendoza", "Sofía Ramírez", "Equipo de Soporte TI", "Mesa de Control TI", "Sin asignar"].map((value) => ({ label: value, value }))} /></div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /><h3 className="font-bold text-slate-900">Descripción de la atención</h3></div>
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} hint={`${description.length}/1000 caracteres`} />
      </section>

      <section className="rounded-xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2"><History className="h-4 w-4 text-blue-600" /><h3 className="font-bold text-slate-900">Información de la actualización</h3></div>
        <Textarea label="Descripción de la actualización *" value={updateDescription} onChange={(event) => { setUpdateDescription(event.target.value); if (error) setError(null); }} error={error ?? undefined} placeholder="Describa los cambios, avances o acciones realizadas..." hint={`${updateDescription.length}/800 caracteres`} />
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600" /> Registrar actualización en el historial</label>
      </section>

      <section className="rounded-xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2"><UserRound className="h-4 w-4 text-blue-600" /><h3 className="font-bold text-slate-900">Datos originales del registro</h3><Badge tone="blue">Solo lectura</Badge></div>
        <div className="grid grid-cols-2 gap-3">
          <ReadonlyValue label="Solicitante" value={attention.requester} />
          <ReadonlyValue label="Correo" value={attention.email} />
          <ReadonlyValue label="Usuario" value={attention.username} />
          <ReadonlyValue label="Perfil" value={attention.profile} />
          <ReadonlyValue label="Estado" value={attention.state} />
          <ReadonlyValue label="Área" value={attention.area} />
        </div>
      </section>
    </div>
  );

  const history = (
    <div className="p-6">
      <div className="relative space-y-5 pl-7 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-px before:bg-slate-200">
        {attention.history.map((item) => (
          <article key={item.id} className="relative rounded-xl border border-slate-200 bg-white p-4 before:absolute before:-left-[25px] before:top-5 before:h-3 before:w-3 before:rounded-full before:bg-blue-600 before:ring-4 before:ring-blue-50">
            <p className="text-sm font-bold text-slate-900">{item.user}</p>
            <p className="mt-1 text-sm text-slate-700">{item.action}</p>
            {item.description ? <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{item.description}</p> : null}
            <p className="mt-2 text-xs text-slate-400">{item.date}</p>
          </article>
        ))}
      </div>
    </div>
  );

  const files = (
    <div className="space-y-3 p-6">
      {attention.files.length ? attention.files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{file.name}</p><p className="text-xs text-slate-500">{file.size} · {file.date}</p></div>
          <Button variant="secondary" size="icon" aria-label={`Descargar ${file.name}`}><Download className="h-4 w-4" /></Button>
        </div>
      )) : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No hay archivos relacionados con esta atención.</div>}
    </div>
  );

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={`${attention.folio} · ${attention.type}`}
      description={`${attention.createdAt} · Responsable: ${attention.responsible}`}
      widthClassName="w-[760px] max-w-[92vw]"
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">Los cambios quedarán registrados en el historial.</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={() => void handleSave()} disabled={updateMutation.isPending}><Save className="h-4 w-4" />{updateMutation.isPending ? "Guardando cambios..." : "Guardar actualización"}</Button>
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-3"><StatusBadge status={status} /><PriorityBadge priority={priority} /><Badge tone="blue">{attention.registry}</Badge></div>
      <Tabs defaultValue="summary" tabs={[{ value: "summary", label: "Resumen", content: summary }, { value: "history", label: "Historial", content: history }, { value: "files", label: "Archivos", content: files }]} />
    </Drawer>
  );
}
