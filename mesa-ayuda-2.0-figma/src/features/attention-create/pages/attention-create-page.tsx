import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, CloudUpload, FileText, MapPin, Save, UserRound } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { SectionCard } from "@/components/ui/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { delay } from "@/shared/lib/delay";

const attentionSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  firstName: z.string().min(1, "El primer apellido es obligatorio."),
  secondName: z.string(),
  username: z.string().min(1, "El nombre de usuario es obligatorio."),
  email: z.string().email("Ingrese un correo válido."),
  phone: z.string(),
  extension: z.string(),
  mobile: z.string(),
  observations: z.string().min(10, "Describa la solicitud con mayor detalle."),
});

type AttentionForm = z.infer<typeof attentionSchema>;

export function AttentionCreatePage() {
  const [profile, setProfile] = useState("Enlace Institucional");
  const [laborStatus, setLaborStatus] = useState("Activo");
  const [scope, setScope] = useState("Estatal");
  const [state, setState] = useState("Jalisco");
  const [municipality, setMunicipality] = useState("Guadalajara");
  const [area, setArea] = useState("Dirección de Tecnologías de la Información");
  const [attendedBy, setAttendedBy] = useState("Mesa de Control TI");
  const [registry, setRegistry] = useState("RMH");
  const [successOpen, setSuccessOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AttentionForm>({
    resolver: zodResolver(attentionSchema),
    defaultValues: {
      name: "Juan Carlos",
      firstName: "Pérez",
      secondName: "Gómez",
      username: "jperez.gomez",
      email: "juan.perez@institucion.gob.mx",
      phone: "5551234567",
      extension: "4321",
      mobile: "",
      observations: "Se solicita soporte para la configuración de la cuenta de correo institucional de enlace. El usuario reporta problemas para sincronizar su bandeja de entrada en dispositivos móviles bajo el protocolo IMAP de la institución.",
    },
  });

  async function onSubmit() {
    await delay(850);
    setSuccessOpen(true);
  }

  return (
    <div className="space-y-6 pb-20">
      <PageHeading
        eyebrow={<><span>Dashboard</span> <span className="px-1">›</span> <span className="text-blue-600">Registrar Atención</span></>}
        title="Registrar Nueva Atención"
        description="Ingrese los datos para dar de alta una nueva solicitud en el sistema."
        actions={<Button asChild variant="secondary"><Link to="/app/atenciones"><ArrowLeft className="h-4 w-4" /> Regresar</Link></Button>}
      />

      <form id="attention-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-5">
        <SectionCard title="Datos de la persona" icon={<UserRound className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Nombre(s)" {...register("name")} error={errors.name?.message} />
            <Input label="Primer apellido" {...register("firstName")} error={errors.firstName?.message} />
            <Input label="Segundo apellido" {...register("secondName")} />
            <Input label="Nombre de usuario" {...register("username")} error={errors.username?.message} />
            <Input label="Correo electrónico" {...register("email")} error={errors.email?.message} />
            <Input label="Teléfono" {...register("phone")} />
            <Input label="Extensión" {...register("extension")} />
            <Input label="Celular" {...register("mobile")} placeholder="Ej. 5559876543" />
            <SelectField label="Perfil" value={profile} onValueChange={setProfile} options={["Enlace Institucional","Capturista","Supervisor","Administrador"].map((value) => ({ label: value, value }))} />
          </div>
        </SectionCard>

        <SectionCard title="Ubicación e institución" icon={<MapPin className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-4">
            <SelectField label="Estatus laboral" value={laborStatus} onValueChange={setLaborStatus} options={["Activo","Inactivo"].map((value) => ({ label: value, value }))} />
            <SelectField label="Ámbito" value={scope} onValueChange={setScope} options={["Federal","Estatal","Municipal"].map((value) => ({ label: value, value }))} />
            <SelectField label="Estado" value={state} onValueChange={setState} options={["Jalisco","Ciudad de México","Estado de México","Nuevo León"].map((value) => ({ label: value, value }))} />
            <SelectField label="Municipio" value={municipality} onValueChange={setMunicipality} options={["Guadalajara","Cuauhtémoc","Toluca","Monterrey"].map((value) => ({ label: value, value }))} />
            <SelectField label="Área de adscripción" value={area} onValueChange={setArea} options={["Dirección de Tecnologías de la Información","Procuraduría de Protección","Mesa de Control TI"].map((value) => ({ label: value, value }))} />
            <SelectField label="Atendido por" value={attendedBy} onValueChange={setAttendedBy} options={["Mesa de Control TI","Alejandro Mendoza","Sofía Ramírez"].map((value) => ({ label: value, value }))} />
          </div>
        </SectionCard>

        <SectionCard title="Detalles de la solicitud" icon={<FileText className="h-4 w-4" />}>
          <p className="mb-2 text-xs font-semibold text-slate-600">Tipo de registro</p>
          <div className="mb-5 flex gap-2">
            {["RMH","RMP","RDVF","RNOA"].map((value) => <button key={value} type="button" onClick={() => setRegistry(value)} className={`focus-ring rounded-lg border px-4 py-2 text-xs font-semibold ${registry === value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}><span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${registry === value ? "bg-blue-600" : "border border-slate-400"}`} />{value}</button>)}
          </div>
          <Textarea label="Observaciones" {...register("observations")} error={errors.observations?.message} className="min-h-24" />
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold text-slate-600">Archivos adjuntos</p>
            <label className="focus-ring flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500 bg-blue-50/20 px-6 text-center hover:bg-blue-50/50">
              <CloudUpload className="h-8 w-8 text-blue-600" />
              <strong className="mt-3 text-sm text-slate-800">Arrastre y suelte sus archivos aquí</strong>
              <span className="mt-1 text-xs text-slate-500">o haga clic para explorar. PDF, JPG, PNG (máx. 10 MB)</span>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="sr-only" />
            </label>
          </div>
        </SectionCard>
      </form>

      <div className="fixed bottom-0 left-[var(--sidebar-width)] right-0 z-20 flex h-16 items-center justify-between border-t border-slate-200 bg-white px-7 shadow-[0_-8px_24px_rgb(15_23_42/0.05)]">
        <Button asChild variant="secondary"><Link to="/app/atenciones">Cancelar</Link></Button>
        <div className="flex gap-3"><Button variant="secondary" onClick={() => toast.success("Borrador guardado correctamente")}>Guardar borrador</Button><Button type="submit" form="attention-form" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Guardando atención..." : "Registrar solicitud"}</Button></div>
      </div>

      <Dialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Atención registrada correctamente"
        description="La información se guardó de manera exitosa y ya está disponible para consulta."
        footer={<><Button variant="secondary" onClick={() => { reset(); setSuccessOpen(false); }}>Registrar otra atención</Button><Button asChild><Link to="/app/atenciones"><CheckCircle2 className="h-4 w-4" /> Ver registro</Link></Button></>}
      >
        <div className="text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></span><div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-left"><div><p className="text-xs text-slate-400">Folio</p><p className="mt-1 font-bold text-blue-700">ATN-2026-01249</p></div><div><p className="text-xs text-slate-400">Estatus inicial</p><p className="mt-1 font-bold text-slate-800">Pendiente</p></div><div><p className="text-xs text-slate-400">Tipo de registro</p><p className="mt-1 font-bold text-slate-800">{registry}</p></div><div><p className="text-xs text-slate-400">Registrado por</p><p className="mt-1 font-bold text-slate-800">Arq. Sofía Huerta</p></div></div></div>
      </Dialog>
    </div>
  );
}
