import { z } from "zod";

export const tokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().int().positive(),
  token_type: z.string().min(1),
  scope: z.string().optional(),
  id: z.number().int().positive(),
});

export const userGroupsSchema = z.object({
  username: z.string().min(3).max(30),
  groups: z.array(z.number().int().positive()).optional(),
});

export type Token = z.infer<typeof tokenSchema>;
export type UserGroups = z.infer<typeof userGroupsSchema>;
