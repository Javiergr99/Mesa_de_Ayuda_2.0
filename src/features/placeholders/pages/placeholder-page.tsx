import { Construction } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="app-page">
      <PageHeading
        eyebrow={<span>Dashboard › {title}</span>}
        title={title}
        description={description}
      />
      <Card className="grid min-h-[420px] place-items-center p-8 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <Construction className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Módulo en preparación</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            La arquitectura y la ruta ya están preparadas para integrar el diseño definitivo cuando
            concluya la maquetación en Figma.
          </p>
        </div>
      </Card>
    </div>
  );
}
