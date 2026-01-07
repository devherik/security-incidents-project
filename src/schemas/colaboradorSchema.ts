import { z } from "zod";

export const ColaboradorSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  username: z.string().min(3).max(30),
  last_login: z.coerce.date().optional(),
  email: z.email(),
  is_active: z.boolean().default(true),
  date_joined: z.string().optional(),
  groups: z.array(z.number().int().positive()).optional(),
  user_permissions: z.array(z.string().min(1)).optional(),
});

export const ColaboradorUpdateSchema = ColaboradorSchema.partial().omit({
  id: true,
  groups: true,
  user_permissions: true,
  date_joined: true,
});

export type ColaboradorUpdate = z.infer<typeof ColaboradorUpdateSchema>;

export type Colaborador = z.infer<typeof ColaboradorSchema>;
