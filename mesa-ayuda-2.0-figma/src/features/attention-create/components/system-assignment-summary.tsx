import { LockKeyhole, UserCheck } from "lucide-react";

export function SystemAssignmentSummary({ userName }: { userName: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <UserCheck className="h-4 w-4 text-blue-600" />
          Atendido por
        </div>
        <p className="mt-1.5 text-sm font-semibold text-slate-800">{userName}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Si no se envía atendido_por, la API asigna automáticamente al usuario autenticado.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <LockKeyhole className="h-4 w-4 text-blue-600" />
          Creado por
        </div>
        <p className="mt-1.5 text-sm font-semibold text-slate-800">{userName}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          creado_por se obtiene del claim sub del JWT y no puede modificarse desde el formulario.
        </p>
      </div>
    </div>
  );
}
