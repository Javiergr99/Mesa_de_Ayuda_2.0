import { useMemo, useState } from "react";
import { Columns3, Eye, FileDown, Grid2X2, List, Plus, Search } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { Tooltip } from "@/components/ui/tooltip";
import { AttentionReadonlyDrawer } from "@/features/attentions/components/attention-readonly-drawer";
import { PriorityBadge, StatusBadge } from "@/features/attentions/components/attention-badges";
import { useAttentions } from "@/features/attentions/api/attentions.queries";
import type { Attention } from "@/features/attentions/model/attention.types";
import { cn } from "@/shared/lib/cn";

const viewOptions = [
  { value: "table", label: "Tabla", icon: List },
  { value: "board", label: "Tablero", icon: Grid2X2 },
] as const;

export function AttentionsPage() {
  const { data = [], isPending } = useAttentions();
  const [view, setView] = useState<"table" | "board">("table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedAttention, setSelectedAttention] = useState<Attention | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.filter((attention) => {
      const matchesQuery = !normalized || [attention.folio, attention.requester, attention.email, attention.type]
        .some((value) => value.toLowerCase().includes(normalized));
      const matchesStatus = !status || attention.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [data, query, status]);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={<><span>Dashboard</span> <span className="px-1">›</span> <span className="text-blue-600">Atenciones</span></>}
        title="Atenciones"
        description="Consulte la información general de las atenciones registradas en Mesa de Ayuda."
        actions={
          <>
            <Button variant="secondary"><FileDown className="h-4 w-4" /> Exportar</Button>
            <Button asChild><Link to="/app/atenciones/nueva"><Plus className="h-4 w-4" /> Registrar atención</Link></Button>
          </>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_220px_auto] items-end gap-4">
          <Input label="Búsqueda rápida" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por folio, nombre, correo o tipo de atención..." icon={<Search className="h-4 w-4" />} />
          <SelectField label="Estatus" value={status} onValueChange={setStatus} placeholder="Todos los estatus" options={[
            { label: "Todos", value: "all" },
            { label: "Pendiente", value: "Pendiente" },
            { label: "En proceso", value: "En proceso" },
            { label: "En espera", value: "En espera" },
            { label: "Finalizada", value: "Finalizada" },
          ].filter((item) => item.value !== "all")} />
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button key={option.value} onClick={() => setView(option.value)} className={cn("focus-ring flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold text-slate-500", view === option.value && "bg-blue-600 text-white") }>
                  <Icon className="h-4 w-4" />{option.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">{filtered.length} atenciones encontradas</p>
        <Button variant="secondary" size="icon" aria-label="Administrar columnas"><Columns3 className="h-4 w-4" /></Button>
      </div>

      {isPending ? <AttentionSkeleton /> : view === "table" ? (
        <AttentionTable attentions={filtered} onView={setSelectedAttention} />
      ) : (
        <AttentionBoard attentions={filtered} onView={setSelectedAttention} />
      )}

      <AttentionReadonlyDrawer attention={selectedAttention} open={Boolean(selectedAttention)} onOpenChange={(open) => !open && setSelectedAttention(null)} />
    </div>
  );
}

function AttentionTable({ attentions, onView }: { attentions: Attention[]; onView: (attention: Attention) => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto app-scrollbar">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead className="bg-slate-50/80 text-left text-xs font-semibold text-slate-500">
            <tr>{["Folio", "Solicitante", "Tipo", "Registro", "Estado", "Prioridad", "Estatus", "Responsable", "Acción"].map((label) => <th key={label} className="border-b border-slate-200 px-4 py-3">{label}</th>)}</tr>
          </thead>
          <tbody>
            {attentions.map((attention) => (
              <tr key={attention.id} className="group border-b border-slate-100 last:border-0">
                <td className="relative px-4 py-4 text-sm font-bold text-slate-900 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:scale-y-0 before:rounded-r before:bg-blue-600 before:transition-transform group-hover:text-blue-600 group-hover:before:scale-y-100">{attention.folio}</td>
                <td className="px-4 py-4"><p className="text-sm font-semibold text-slate-800">{attention.requester}</p><p className="max-w-48 truncate text-xs text-slate-400">{attention.email}</p></td>
                <td className="px-4 py-4 text-sm text-slate-600">{attention.type}</td>
                <td className="px-4 py-4 text-sm font-medium text-slate-700">{attention.registry}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{attention.state}</td>
                <td className="px-4 py-4"><PriorityBadge priority={attention.priority} /></td>
                <td className="px-4 py-4"><StatusBadge status={attention.status} /></td>
                <td className="px-4 py-4 text-sm text-slate-600">{attention.responsible}</td>
                <td className="px-4 py-4">
                  <Tooltip content="Ver registro">
                    <Button variant="secondary" size="icon" onClick={() => onView(attention)} aria-label={`Ver atención ${attention.folio}`}><Eye className="h-4 w-4" /></Button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AttentionBoard({ attentions, onView }: { attentions: Attention[]; onView: (attention: Attention) => void }) {
  const statuses: Attention["status"][] = ["Pendiente", "En proceso", "En espera", "Finalizada"];
  return (
    <div className="grid grid-cols-4 gap-4">
      {statuses.map((status) => {
        const items = attentions.filter((attention) => attention.status === status);
        return (
          <Card key={status} className="min-h-[460px] bg-slate-50/60 p-3">
            <div className="mb-3 flex items-center justify-between px-1"><StatusBadge status={status} /><span className="text-xs font-bold text-slate-500">{items.length}</span></div>
            <div className="space-y-3">
              {items.map((attention) => (
                <motion.article key={attention.id} whileHover={{ y: -2 }} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-200">
                  <div className="flex items-start justify-between gap-3"><p className="text-xs font-bold text-blue-600">{attention.folio}</p><PriorityBadge priority={attention.priority} /></div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{attention.type}</h3>
                  <p className="mt-1 text-sm text-slate-600">{attention.requester}</p>
                  <p className="mt-3 text-xs text-slate-500">{attention.registry} · {attention.state}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-xs text-slate-500">{attention.updatedAt}</span><Tooltip content="Ver registro"><Button variant="secondary" size="icon" onClick={() => onView(attention)} aria-label={`Ver atención ${attention.folio}`}><Eye className="h-4 w-4" /></Button></Tooltip></div>
                </motion.article>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AttentionSkeleton() {
  return <Card className="overflow-hidden p-5"><div className="space-y-3">{["a","b","c","d"].map((key) => <div key={key} className="relative h-16 overflow-hidden rounded-lg bg-slate-100"><span className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" /></div>)}</div></Card>;
}
