import "dotenv/config";

import { z } from "zod";

// Isso serve para garantir que as variáveis de ambiente sejam carregadas corretamente
// e que o TypeScript saiba quais são as variáveis de ambiente disponíveis
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
