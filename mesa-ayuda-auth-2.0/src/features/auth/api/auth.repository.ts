import { httpAuthRepository } from "@/features/auth/api/http-auth.repository";
import { mockAuthRepository } from "@/features/auth/api/mock-auth.repository";
import { env } from "@/shared/config/env";

export const authRepository = env.enableMocks ? mockAuthRepository : httpAuthRepository;
