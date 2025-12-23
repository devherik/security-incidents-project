import { z } from "zod";

export const ColaboradorSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  username: z.string().min(3).max(30),
  last_login: z.date().optional(),
  email: z.email(),
  is_active: z.boolean().default(true),
  date_joined: z.date().default(() => new Date()),
  groups: z.array(z.number().int().positive()).optional(),
  user_permissions: z.array(z.number().int().positive()).optional(),
});

export type Colaborador = z.infer<typeof ColaboradorSchema>;
