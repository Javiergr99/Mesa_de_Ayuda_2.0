import { useMemo, useState } from "react";
import { ClipboardList, Download, Eye, ListFilter, Pause, RefreshCw, Search, Timer, Waves, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { StatCard } from "@/components/ui/stat-card";
import { Tooltip } from "@/components/ui/tooltip";
import { TrackingDrawer } from "@/features/tracking/components/tracking-drawer";
import { PriorityBadge, StatusBadge } from "@/features/attentions/components/attention-badges";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import type { Attention } from "@/features/attentions/model/attention.types";

export function TrackingPage() {
  const { data = [], isFetching, refetch } = useAttentions();
  const [query, setQuery] = useState("");
  const [registry, setRegistry] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Attention | null>(null);

  const filtered = useMemo(() => data.filter((attention) => {
    const text = query.trim().toLowerCase();
    return (!text || [attention.folio, attention.requester, attention.email, attention.type].some((value) => value.toLowerCase().includes(text)))
      && (!registry || attention.registry === registry)
      && (!priority || attention.priority === priority)
      && (!status || attention.status === status);
  }), [data, priority, query, registry, status]);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={<><span>Dashboard</span> <span className="px-1">›</span> <span className="text-blue-600">Seguimiento</span></>}
        title="Seguimiento de atenciones"
        description="Consulte los registros capturados y actualice el estatus de cada atención."
        actions={<><Button variant="secondary"><Download className="h-4 w-4" /> Exportar</Button><Button variant="secondary" onClick={() => void refetch()} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Actualizar listado</Button></>}
      />

      <div className="grid grid-cols-5 gap-4">
        <StatCard title="Total en seguimiento" value="326" detail="Atenciones activas" icon={ClipboardList} tone="blue" />
        <StatCard title="Pendientes" value="86" detail="Sin iniciar atención" icon={Timer} tone="amber" />
        <StatCard title="En proceso" value="214" detail="Actualmente atendidas" icon={Waves} tone="violet" />
        <StatCard title="En espera" value="26" detail="Requieren información" icon={Pause} tone="slate" />
        <StatCard title="Finalizadas" value="934" detail="Atenciones concluidas" icon={CircleCheck} tone="emerald" />
      </div>

      <div className="flex items-center gap-7 border-b border-slate-200">
        {["Todos", "Pendientes", "En proceso", "En espera", "Finalizadas", "Canceladas"].map((label, index) => <button key={label} className={`relative min-h-11 text-sm font-semibold ${index === 0 ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600" : "text-slate-500"}`}>{label}<span className="ml-2 text-xs">{[1248,86,214,26,934,14][index]}</span></button>)}
      </div>

      <Card className="p-6">
        <Input label="Búsqueda rápida" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por folio, nombre, correo, usuario o tipo de atención..." icon={<Search className="h-4 w-4" />} />
        <div className="mt-5 grid grid-cols-3 gap-4">
          <SelectField label="Tipo de Registro" value={registry} onValueChange={setRegistry} placeholder="Seleccionar Registro" options={["RMH","RMP","RDVF","RNOA"].map((value) => ({ label: value, value }))} />
          <SelectField label="Tipo de Prioridad" value={priority} onValueChange={setPriority} placeholder="Seleccionar Prioridad" options={["Baja","Media","Alta","Urgente"].map((value) => ({ label: value, value }))} />
          <SelectField label="Tipo de Estatus" value={status} onValueChange={setStatus} placeholder="Seleccionar Estatus" options={["Pendiente","En proceso","En espera","Finalizada","Cancelada"].map((value) => ({ label: value, value }))} />
        </div>
        <div className="mt-5 flex justify-end gap-3"><Button variant="secondary" onClick={() => { setRegistry(""); setPriority(""); setStatus(""); setQuery(""); }}>Limpiar filtros</Button><Button><ListFilter className="h-4 w-4" /> Aplicar filtros</Button></div>
      </Card>

      <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-900">{filtered.length} atenciones encontradas</p><SelectField value="25" onValueChange={() => undefined} options={[{label:"25 por página",value:"25"}]} className="w-40" /></div>

      <Card className="overflow-hidden">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="bg-slate-50/80 text-left text-xs font-semibold text-slate-500"><tr>{["Folio","Solicitante","Registro","Prioridad","Estatus","Estado","Acción"].map((label) => <th key={label} className="border-b border-slate-200 px-4 py-3">{label}</th>)}</tr></thead>
          <tbody>{filtered.map((attention) => <tr key={attention.id} className="group border-b border-slate-100 last:border-0">
            <td className="relative px-4 py-4 text-sm font-bold text-slate-900 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:scale-y-0 before:rounded-r before:bg-blue-600 before:transition-transform group-hover:text-blue-600 group-hover:before:scale-y-100">{attention.folio}</td>
            <td className="px-4 py-4"><p className="text-sm font-semibold text-slate-800">{attention.requester}</p><p className="max-w-48 truncate text-xs text-slate-400">{attention.email}</p></td>
            <td className="px-4 py-4 text-sm text-slate-700">{attention.registry}</td>
            <td className="px-4 py-4"><PriorityBadge priority={attention.priority} /></td>
            <td className="px-4 py-4"><StatusBadge status={attention.status} /></td>
            <td className="px-4 py-4 text-sm text-slate-700">{attention.responsible}</td>
            <td className="px-4 py-4"><Tooltip content="Ver y actualizar seguimiento"><Button variant="secondary" size="icon" onClick={() => setSelected(attention)} aria-label={`Ver seguimiento ${attention.folio}`}><Eye className="h-4 w-4" /></Button></Tooltip></td>
          </tr>)}</tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between text-sm text-slate-500"><span>Mostrando 1–25 de 1,248 resultados</span><div className="flex gap-2"><Button variant="secondary" size="sm">Anterior</Button><Button size="sm">1</Button><Button variant="secondary" size="sm">2</Button><Button variant="secondary" size="sm">3</Button><Button variant="secondary" size="sm">Siguiente</Button></div></div>

      <TrackingDrawer attention={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
