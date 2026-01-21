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

export const periodoEnum = z.enum([
  "Últimas 24 horas",
  "Últimos 7 dias",
  "Últimos 30 dias",
  "Últimos 90 dias",
  "Todos",
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
export type Periodo = z.infer<typeof periodoEnum>;
export type DiaSemana = z.infer<typeof diaSemanaEnum>;
