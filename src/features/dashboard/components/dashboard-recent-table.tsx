import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/features/attentions/components/attention-badges";
import type { Attention } from "@/features/attentions/model/attention.types";

export function DashboardRecentTable({
  attentions,
  loading,
}: {
  attentions: Attention[];
  loading: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900">Actividad reciente</h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Registros devueltos por el listado principal para el periodo seleccionado.
          </p>
        </div>

        <Link
          to="/app/atenciones"
          className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          Ver atenciones
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="overflow-x-auto app-scrollbar">
        <table className="w-full min-w-[820px] border-collapse">
          <thead className="bg-slate-50/80 text-left text-[10px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-3">Folio</th>
              <th className="px-4 py-3">Persona</th>
              <th className="px-4 py-3">Tipo de atención</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? ["a", "b", "c", "d", "e"].map((key) => (
                  <tr key={key} className="border-t border-slate-100">
                    <td colSpan={6} className="px-5 py-3">
                      <div className="h-7 animate-pulse rounded-md bg-slate-100" />
                    </td>
                  </tr>
                ))
              : attentions.map((attention) => (
                  <tr
                    key={attention.id}
                    className="border-t border-slate-100 text-[11px] transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5 font-bold text-blue-600">
                      {attention.reference}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {attention.requester}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {attention.caseType}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {attention.registry}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {attention.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={attention.status} />
                    </td>
                  </tr>
                ))}

            {!loading && !attentions.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                  No hay atenciones para mostrar en el periodo seleccionado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
