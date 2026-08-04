import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.email("Ingrese un correo electrónico válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
