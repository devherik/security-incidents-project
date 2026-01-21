import { z } from "zod";

export const TokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().int().positive(),
  token_type: z.string().min(1),
  scope: z.string().optional(),
  id: z.number().int().positive(),
});

export const UserGroupsSchema = z.object({
  username: z.string().min(3).max(30),
  groups: z.array(z.number().int().positive()).optional(),
});

export const LoginCredentialsSchema = z.object({
  username: z.string().min(6, "Insira seu usuário - mínimo 6 caracteres"),
  password: z.string().min(6, "Insira a senha - mínimo 6 caracteres"),
});

export const NotificationSchema = z.object({
  id: z.number().int().positive(),
  tipo_alerta: z.string().min(1).max(100),
  lida: z.boolean().default(false),
  dtcriacao: z.string().min(1),
});

export type Token = z.infer<typeof TokenSchema>;
export type UserGroups = z.infer<typeof UserGroupsSchema>;
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
