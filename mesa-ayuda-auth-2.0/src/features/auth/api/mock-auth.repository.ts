import type { AuthRepository, AuthSession, LoginInput, LoginResult, VerifyMfaInput } from "@/features/auth/model/auth.types";
import { DEMO_CREDENTIALS } from "@/shared/constants/demo";
import { delay } from "@/shared/lib/delay";

const demoUser = {
  id: "usr-admin-001",
  name: "Arq. Sofía Huerta",
  email: DEMO_CREDENTIALS.identifier,
  role: "Administrador",
  area: "Mesa de Control TI",
  scope: "Nacional",
  accountStatus: "active" as const,
  mfaConfigured: true,
};

export const mockAuthRepository: AuthRepository = {
  async login(input: LoginInput): Promise<LoginResult> {
    await delay(850);

    if (input.identifier !== DEMO_CREDENTIALS.identifier || input.password !== DEMO_CREDENTIALS.password) {
      throw new Error("El correo electrónico o la contraseña no son correctos.");
    }

    return {
      tempToken: "demo-temp-token",
      requiresMfaSetup: false,
      user: demoUser,
    };
  },

  async verifyMfa(input: VerifyMfaInput): Promise<AuthSession> {
    await delay(800);

    if (input.tempToken !== "demo-temp-token" || input.code !== DEMO_CREDENTIALS.otp) {
      throw new Error("El código ingresado no es correcto o ha expirado.");
    }

    return { user: demoUser };
  },

  async configureMfa(input: VerifyMfaInput): Promise<AuthSession> {
    return this.verifyMfa(input);
  },

  async logout(): Promise<void> {
    await delay(250);
  },
};
