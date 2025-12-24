import { z } from "zod";

export const userRoleEnum = z.enum([
  "usuario",
  "gestor_setor",
  "admin_sesmt",
  "gestor_unidade",
  "admin_sesmt_alterar",
]);

export const rciStatusEnum = z.enum([
  "Aberto",
  "Em Análise",
  "Em Andamento",
  "Finalizado",
  "Rejeitado",
]);

export const severidadeEnum = z.enum([
  "Intolerável",
  "Crítico",
  "Moderado",
  "Baixo",
  "Insignificante",
]);

export const diaSemanaEnum = z.enum([
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
  "dom",
]);

export type UserRole = z.infer<typeof userRoleEnum>;
export type RciStatus = z.infer<typeof rciStatusEnum>;
export type Severidade = z.infer<typeof severidadeEnum>;
export type DiaSemana = z.infer<typeof diaSemanaEnum>;
