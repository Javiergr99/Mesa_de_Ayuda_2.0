import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, List, Plus } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { format, startOfWeek, addDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/shared/lib/cn";

const events = [
  { id:"1", day:2, time:"10:00", title:"Reunión de Soporte Técnico", tone:"blue" },
  { id:"2", day:8, time:"12:00", title:"Seguimiento Ticket #204", tone:"violet" },
  { id:"3", day:16, time:"16:00", title:"Mantenimiento del Servidor", tone:"emerald" },
  { id:"4", day:22, time:"09:00", title:"Revisión trimestral de KPIs", tone:"amber" },
];

const eventTones: Record<string,string> = { blue:"border-blue-200 bg-blue-50 text-blue-700", violet:"border-violet-200 bg-violet-50 text-violet-700", emerald:"border-emerald-200 bg-emerald-50 text-emerald-700", amber:"border-amber-200 bg-amber-50 text-amber-700" };

const eventsByDay = new Map<number, (typeof events)[number][]>();
for (const event of events) {
  const dayEvents = eventsByDay.get(event.day);
  if (dayEvents) {
    dayEvents.push(event);
  } else {
    eventsByDay.set(event.day, [event]);
  }
}

export function OrganizerPage() {
  const [view, setView] = useState<"month"|"week"|"list">("month");
  const [eventOpen, setEventOpen] = useState(false);
  const weekStart = useMemo(() => startOfWeek(new Date(2026, 9, 12), { weekStartsOn: 1 }), []);

  return <div className="app-page">
    <PageHeading title="Organizador" description="Calendario, eventos y recordatorios" actions={<><Button variant="secondary"><CalendarDays className="h-4 w-4" /> Hoy</Button><Button onClick={() => setEventOpen(true)}><Plus className="h-4 w-4" /> Nuevo evento</Button></>} />
    <Card className="p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-2"><Button variant="secondary" size="icon"><ChevronLeft className="h-4 w-4" /></Button><h2 className="min-w-48 text-center text-base font-bold text-slate-900">Octubre 2026</h2><Button variant="secondary" size="icon"><ChevronRight className="h-4 w-4" /></Button></div><div className="flex w-fit max-w-full overflow-x-auto rounded-lg bg-slate-100 p-1 app-scrollbar">{[{value:"month",label:"Mensual"},{value:"week",label:"Semanal"},{value:"list",label:"Lista"}].map((item) => <button key={item.value} onClick={() => setView(item.value as typeof view)} className={cn("focus-ring h-9 rounded-md px-4 text-xs font-semibold text-slate-500", view===item.value && "bg-blue-600 text-white shadow-sm")}>{item.label}</button>)}</div></div></Card>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
      {view === "month" ? <MonthView /> : view === "week" ? <WeekView weekStart={weekStart} /> : <ListView />}
      <aside className="space-y-5"><UpcomingEvents /><Reminders /></aside>
    </div>
    <Dialog open={eventOpen} onOpenChange={setEventOpen} title="Nuevo evento" description="Agregue un evento a su agenda." footer={<><Button variant="secondary" onClick={() => setEventOpen(false)}>Cancelar</Button><Button onClick={() => setEventOpen(false)}>Guardar</Button></>}>
      <div className="space-y-4"><Input label="Título del evento *" defaultValue="Reunión mensual de revisión de SLA"/><div className="grid gap-4 sm:grid-cols-2"><Input label="Fecha" type="date" defaultValue="2026-10-10"/><Input label="Hora inicio / fin" defaultValue="10:00 AM - 11:30 AM"/></div><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Tipo de evento" value="Reunión" onValueChange={() => undefined} options={["Reunión","Seguimiento","Actividad","Recordatorio"].map((value)=>({label:value,value}))}/><SelectField label="Prioridad" value="Alta" onValueChange={() => undefined} options={["Baja","Media","Alta"].map((value)=>({label:value,value}))}/></div><SelectField label="Responsable" value="Alejandro Mendoza" onValueChange={() => undefined} options={["Alejandro Mendoza","Sofía Ramírez"].map((value)=>({label:value,value}))}/><Textarea label="Descripción" defaultValue="Revisión de métricas correspondientes al cierre de mes, SLAs alcanzados y definición de planes de mitigación."/></div>
    </Dialog>
  </div>;
}

function MonthView() {
  const days = Array.from({length:35},(_,index)=>index+1);
  return <Card className="overflow-x-auto app-scrollbar"><div className="min-w-[720px]"><div className="grid grid-cols-7 bg-slate-50 text-center text-xs font-semibold text-slate-500">{["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((day)=><div key={day} className="border-b border-r border-slate-200 py-3 last:border-r-0">{day}</div>)}</div><div className="grid grid-cols-7">{days.map((day)=><div key={day} className="min-h-28 border-b border-r border-slate-200 p-2 last:border-r-0"><span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs font-semibold text-slate-600",day===10&&"bg-blue-600 text-white")}>{day}</span><div className="mt-1 space-y-1">{(eventsByDay.get(day) ?? []).map((event)=><button key={event.id} className={cn("block w-full truncate rounded-md border px-2 py-1 text-left text-[10px] font-semibold",eventTones[event.tone])}>{event.time} {event.title}</button>)}</div></div>)}</div></div></Card>;
}

function WeekView({weekStart}:{weekStart:Date}) {
  const days=Array.from({length:7},(_,index)=>addDays(weekStart,index));
  const hours=Array.from({length:12},(_,index)=>8+index);
  return <Card className="overflow-auto app-scrollbar"><div className="min-w-[900px]"><div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-slate-200 bg-slate-50"><div/><>{days.map((day)=><div key={day.toISOString()} className="border-l border-slate-200 p-3 text-center"><p className="text-xs text-slate-500">{format(day,"EEE",{locale:es})}</p><p className="mt-1 font-bold text-slate-900">{format(day,"d")}</p></div>)}</></div>{hours.map((hour)=><div key={hour} className="grid grid-cols-[70px_repeat(7,1fr)]"><div className="border-b border-r border-slate-200 p-2 text-right text-xs text-slate-400">{hour}:00</div>{days.map((day,index)=><div key={`${day.toISOString()}-${hour}`} className="relative min-h-14 border-b border-r border-slate-200">{hour===10&&index===1?<div className="absolute inset-x-1 top-1 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs font-semibold text-blue-700">Reunión de soporte</div>:null}</div>)}</div>)}</div></Card>;
}

function ListView() {
  return <LazyMotion features={domAnimation}><Card className="p-5"><h2 className="font-bold text-slate-900">Próximos eventos</h2><div className="mt-4 space-y-3">{events.map((event)=><m.article key={event.id} whileHover={{x:3}} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"><span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-600"><Clock3 className="h-5 w-5"/></span><div className="flex-1"><p className="text-sm font-bold text-slate-900">{event.title}</p><p className="mt-1 text-xs text-slate-500">Octubre {event.day}, 2026 · {event.time}</p></div><Button variant="secondary" size="icon"><List className="h-4 w-4"/></Button></m.article>)}</div></Card></LazyMotion>;
}

function UpcomingEvents() {return <Card className="p-4"><h3 className="font-bold text-slate-900">Próximos eventos</h3><div className="mt-4 space-y-2">{events.slice(0,4).map((event)=><div key={event.id} className={cn("rounded-lg border-l-4 p-3",eventTones[event.tone])}><p className="text-xs font-bold">{event.title}</p><p className="mt-1 text-[11px] opacity-75">{event.time}</p></div>)}</div></Card>}
function Reminders(){return <Card className="p-4"><h3 className="font-bold text-slate-900">Recordatorios pendientes</h3><div className="mt-4 space-y-2">{["Enviar reporte mensual de SLAs","Llamar a proveedor de hosting","Actualizar plantilla de tickets"].map((item)=><label key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-700"><input type="checkbox" className="mt-0.5 h-4 w-4 rounded"/><span>{item}<small className="mt-1 block text-amber-600">Vence pronto</small></span></label>)}</div></Card>}
