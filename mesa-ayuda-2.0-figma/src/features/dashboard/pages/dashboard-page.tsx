import { Activity, CheckCircle2, ClipboardList, Clock3, FileText, PieChart, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";
import { SelectField } from "@/components/ui/select-field";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import { attentionsMock } from "@/features/attentions/data/attentions.mock";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={<span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Mesa de Ayuda 2.0</span>}
        title="Panel de control"
        description="Resumen general de la operación, actividad y seguimiento de registros."
        actions={<div className="w-56"><SelectField label="Periodo" value="30" onValueChange={() => undefined} options={[{label:"Últimos 30 días",value:"30"},{label:"Últimos 3 meses",value:"90"},{label:"Año actual",value:"year"}]} /></div>}
      />

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Atenciones registradas" value="1,248" detail="156 registradas este mes" icon={ClipboardList} tone="blue" />
        <StatCard title="Solicitudes pendientes" value="86" detail="14 requieren atención prioritaria" icon={FileText} tone="amber" />
        <StatCard title="Atenciones finalizadas" value="934" detail="74.8 % de resolución general" icon={CheckCircle2} tone="emerald" />
        <StatCard title="Usuarios activos" value="142" detail="Usuarios con acceso vigente" icon={Users} tone="violet" />
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between"><div><h2 className="flex items-center gap-2 font-bold text-slate-900"><TrendingUp className="h-5 w-5 text-blue-600" /> Actividad mensual</h2><p className="mt-1 text-xs text-slate-500">Comparación de atenciones registradas y solicitudes recibidas.</p></div><div className="flex gap-4 text-xs text-slate-500"><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />Atenciones</span><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />Solicitudes</span></div></div>
          <LineChart />
        </Card>
        <Card className="p-5"><h2 className="flex items-center gap-2 font-bold text-slate-900"><PieChart className="h-5 w-5 text-violet-600" /> Distribución por estatus</h2><p className="mt-1 text-xs text-slate-500">Estado general de las atenciones registradas.</p><DonutChart /></Card>
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-5">
        <Card className="overflow-hidden"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Actividad reciente</h2><p className="mt-1 text-xs text-slate-500">Últimos movimientos registrados en la plataforma.</p></div><table className="w-full"><thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-5 py-3">Folio</th><th className="px-4 py-3">Persona</th><th className="px-4 py-3">Registro</th><th className="px-4 py-3">Estatus</th></tr></thead><tbody>{attentionsMock.map((attention) => <tr key={attention.id} className="group border-t border-slate-100"><td className="relative px-5 py-4 text-sm font-bold text-slate-900 before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:scale-y-0 before:bg-blue-600 group-hover:text-blue-600 group-hover:before:scale-y-100">{attention.folio}</td><td className="px-4 py-4 text-sm text-slate-700">{attention.requester}</td><td className="px-4 py-4 text-sm text-slate-600">{attention.registry}</td><td className="px-4 py-4"><StatusBadge status={attention.status} /></td></tr>)}</tbody></table></Card>
        <Card className="p-5"><h2 className="font-bold text-slate-900">Indicadores operativos</h2><div className="mt-5 space-y-5">{[["Atenciones dentro del tiempo objetivo",82,"bg-emerald-500"],["Solicitudes atendidas durante el mes",74,"bg-blue-500"],["Registros con información completa",91,"bg-violet-500"]].map(([label,value,color]) => <div key={String(label)}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-600">{label}</span><strong>{value}%</strong></div><div className="h-2 rounded-full bg-slate-100"><motion.div initial={{width:0}} animate={{width:`${value}%`}} transition={{duration:.8}} className={`h-full rounded-full ${color}`} /></div></div>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><Users className="h-5 w-5 text-blue-600" /><p className="mt-3 text-2xl font-bold">142</p><p className="text-xs text-slate-500">Usuarios activos</p></div><div className="rounded-xl bg-slate-50 p-4"><Clock3 className="h-5 w-5 text-amber-600" /><p className="mt-3 text-2xl font-bold">18 h</p><p className="text-xs text-slate-500">Tiempo promedio</p></div></div></Card>
      </div>
    </div>
  );
}

function LineChart() {
  const pointsA = "20,190 130,145 240,160 350,105 460,125 570,65 680,90";
  const pointsB = "20,225 130,205 240,185 350,170 460,195 570,150 680,165";
  return <div className="mt-5 overflow-hidden rounded-xl"><svg viewBox="0 0 700 270" className="w-full"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b82f6" stopOpacity=".18"/><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></linearGradient></defs>{[40,90,140,190,240].map((y) => <line key={y} x1="20" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeDasharray="4 5"/>)}<polygon points={`20,240 ${pointsA} 680,240`} fill="url(#area)"/><motion.polyline points={pointsA} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1}}/><motion.polyline points={pointsB} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1,delay:.15}}/>{["Ene","Feb","Mar","Abr","May","Jun","Jul"].map((month,index) => <text key={month} x={20+index*110} y="260" textAnchor={index===0?"start":index===6?"end":"middle"} fontSize="11" fill="#64748b">{month}</text>)}</svg></div>;
}

function DonutChart() {
  return <div className="mt-6"><div className="relative mx-auto h-52 w-52"><div className="absolute inset-2 rounded-full" style={{background:"conic-gradient(#10b981 0 38%, #8b5cf6 38% 66%, #f59e0b 66% 100%)"}}/><div className="absolute inset-10 grid place-items-center rounded-full bg-white text-center shadow-inner"><div><p className="text-3xl font-bold">1,268</p><p className="text-xs text-slate-500">Registros</p></div></div></div><div className="mt-5 space-y-2">{[["Finalizado","38%","bg-emerald-500"],["En seguimiento","28%","bg-violet-500"],["Pendiente","34%","bg-amber-500"]].map(([label,value,color]) => <div key={label} className="flex items-center justify-between rounded-lg px-2 py-1.5 transition hover:translate-x-1"><span className="flex items-center gap-2 text-sm text-slate-600"><i className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span><strong className="text-sm">{value}</strong></div>)}</div></div>;
}
