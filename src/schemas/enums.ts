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
