import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { PasswordField } from "@/components/ui/password-field";
import { Spinner } from "@/components/ui/spinner";
import { TextField } from "@/components/ui/text-field";
import { authRepository } from "@/features/auth/api/auth.repository";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";

export function LoginForm() {
  const navigate = useNavigate();
  const setPendingLogin = useAuthStore((state) => state.setPendingLogin);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: authRepository.login,
    onSuccess: (result) => {
      setPendingLogin(result);
      void navigate(result.requiresMfaSetup ? "/mfa/configurar" : "/mfa/verificar");
    },
    onError: (error) => {
      setGeneralError(error instanceof Error ? error.message : "No fue posible iniciar sesión.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setGeneralError(null);
    loginMutation.mutate(values);
  });

  return (
    <form className="space-y-4" onSubmit={(event) => void onSubmit(event)} noValidate>
      {generalError ? (
        <Alert tone="error" title="No fue posible iniciar sesión">
          {generalError}
        </Alert>
      ) : null}

      <TextField
        label="Correo electrónico"
        type="email"
        autoComplete="username"
        placeholder="nombre@institucion.gob.mx"
        leadingIcon={<Mail className="h-[18px] w-[18px]" />}
        error={form.formState.errors.identifier?.message}
        disabled={loginMutation.isPending}
        {...form.register("identifier")}
      />

      <PasswordField
        label="Contraseña"
        autoComplete="current-password"
        placeholder="Ingresa tu contraseña"
        error={form.formState.errors.password?.message}
        disabled={loginMutation.isPending}
        {...form.register("password")}
      />

      <div className="flex items-center justify-between gap-3 pt-1">
        <CheckboxField
          id="remember"
          label="Mantener mi sesión iniciada"
          checked={form.watch("remember")}
          onCheckedChange={(checked) => form.setValue("remember", checked)}
        />

        <Link
          to="/recuperar-acceso"
          className="focus-ring shrink-0 rounded text-[13px] font-semibold-token text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" size="lg" fullWidth disabled={loginMutation.isPending} className="mt-2">
        {loginMutation.isPending ? (
          <>
            <Spinner /> Verificando…
          </>
        ) : (
          "Continuar"
        )}
      </Button>

      <div className="flex gap-3 pt-5 text-[12px] leading-[1.55] text-[var(--color-text-secondary)]">
        <ShieldCheck className="mt-0.5 h-[17px] w-[17px] shrink-0" />
        <p>Por seguridad, nunca compartas tus credenciales ni tus códigos de verificación.</p>
      </div>
    </form>
  );
}
