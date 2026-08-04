import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return <main className="grid min-h-dvh place-items-center bg-slate-50 p-6 text-center"><div><p className="text-sm font-bold text-blue-600">404</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Página no encontrada</h1><p className="mt-2 text-slate-500">La ruta solicitada no existe.</p><Button asChild className="mt-6"><Link to="/app/dashboard">Volver al Dashboard</Link></Button></div></main>;
}
