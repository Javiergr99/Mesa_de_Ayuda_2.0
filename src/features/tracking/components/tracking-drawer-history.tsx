import type { Attention } from "@/features/attentions/model/attention.types";
import { Clock3, Info } from "lucide-react";

export function TrackingDrawerHistory({
  attention,
}: {
  attention: Attention;
}) {
  const timestamps = [
    {
      key: "created",
      title: "Registro creado",
      value: attention.createdAt,
    },
    {
      key: "updated",
      title: "Última actualización registrada",
      value: attention.updatedAt,
    },
  ];

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Historial de actualizaciones
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Se muestran únicamente las marcas temporales disponibles en el
          contrato actual.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-700">
        <Info className="mt-1 h-4 w-4 shrink-0" />
        <p>
          La API disponible no expone un endpoint público de auditoría
          detallada. Por ello no se inventan autores, cambios de estatus ni
          comentarios históricos.
        </p>
      </div>

      <div className="relative space-y-5 pl-8">
        <span className="absolute bottom-4 left-[11px] top-4 w-px bg-slate-200" />

        {timestamps.map((item) => (
          <article key={item.key} className="relative">
            <span className="absolute -left-8 top-1 grid h-6 w-6 place-items-center rounded-full border border-blue-100 bg-blue-50 text-blue-600">
              <Clock3 className="h-3.5 w-3.5" />
            </span>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-xs text-slate-500">{item.value}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
