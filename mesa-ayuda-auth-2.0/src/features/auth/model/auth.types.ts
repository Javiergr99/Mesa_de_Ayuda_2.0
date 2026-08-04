export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  area: string;
  scope: string;
  accountStatus: "active" | "inactive";
  mfaConfigured: boolean;
};

export type LoginInput = {
  identifier: string;
  password: string;
  remember: boolean;
};

export type LoginResult = {
  tempToken: string;
  requiresMfaSetup: boolean;
  user: AuthUser;
};

export type VerifyMfaInput = {
  tempToken: string;
  code: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type AuthRepository = {
  login(input: LoginInput): Promise<LoginResult>;
  verifyMfa(input: VerifyMfaInput): Promise<AuthSession>;
  configureMfa(input: VerifyMfaInput): Promise<AuthSession>;
  logout(): Promise<void>;
};
