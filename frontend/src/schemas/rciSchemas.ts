import { z } from "zod";

import { getNextMonth } from "../utils/dateUtil";

import { ColaboradorSchema } from "./colaboradorSchema";
import {
  UnidadeSetorSchema,
  UnidadeSchema,
  CondicaoInseguraSchema,
  NivelRiscoSchema,
} from "./stateSchemas";
import { rciStatusEnum } from "./enums";

export const RciSchema = z.object({
  id: z.number().int().positive(),
  autor: ColaboradorSchema,
  unidade: UnidadeSchema,
  setor: UnidadeSetorSchema,
  condicao_insegura: CondicaoInseguraSchema,
  nivel_risco: NivelRiscoSchema,
  data_limite: z.coerce.date(),
  status: rciStatusEnum,
  tipo: z.string().min(1).max(100),
  link_plano_acao: z.url().optional(),
  detalhamento: z.string().min(1).max(1000),
  solucao: z.string().min(1).max(1000).optional(),
  dtcriacao: z.coerce.date().default(() => new Date()),
  dtmodificacao: z.coerce.date().default(() => new Date()),
});

export const RciCreateSchema = z.object({
  autor_id: z
    .number()
    .int("Autor ID deve ser um número inteiro")
    .positive("Autor ID deve ser positivo"),
  unidade_id: z
    .number()
    .int("Unidade ID deve ser um número inteiro")
    .positive("Unidade ID deve ser positivo"),
  setor_id: z
    .number()
    .int("Setor ID deve ser um número inteiro")
    .positive("Setor ID deve ser positivo"),
  condicao_insegura_id: z
    .number()
    .int("Condição Insegura ID deve ser um número inteiro")
    .positive("Condição Insegura ID deve ser positivo"),
  nivel_risco_id: z
    .number()
    .int("Nível de Risco ID deve ser um número inteiro")
    .positive("Nível de Risco ID deve ser positivo"),
  data_limite: z.coerce
    .string("Data Limite deve ser uma string no formato 'YYYY-MM-DD'")
    .default(() => getNextMonth())
    .optional(),
  status: rciStatusEnum.default("Aberto"),
  tipo: z
    .string()
    .min(1, "Tipo deve ter pelo menos 1 caractere")
    .max(100, "Tipo deve ter no máximo 100 caracteres"),
  link_plano_acao: z
    .string("Link do Plano de Ação deve ser uma URL válida")
    .optional()
    .default(""),
  detalhamento: z
    .string()
    .min(15, "Detalhamento deve ter pelo menos 15 caracteres")
    .max(1000, "Detalhamento deve ter no máximo 1000 caracteres"),
  solucao: z
    .string()
    .min(15, "Solução deve ter pelo menos 15 caracteres")
    .max(1000, "Solução deve ter no máximo 1000 caracteres")
    .optional(),
});

export const RciUpdateSchema = RciCreateSchema.pick({
  autor_id: true,
  unidade_id: true,
  setor_id: true,
  condicao_insegura_id: true,
  nivel_risco_id: true,
  detalhamento: true,
  status: true,
  link_plano_acao: true,
  data_limite: true,
}).extend({
  id: z.number().int().positive(),
  justificativa: z
    .string()
    .min(15, "Justificativa deve ter pelo menos 15 caracteres")
    .max(1000, "Justificativa deve ter no máximo 1000 caracteres")
});

export const RciFinalizeSchema = RciCreateSchema.pick({
  id: true,
  solucao: true,
  status: true,
}).extend({
  id: z.number().int().positive(),
});

export const RciLogSchema = z.object({
  id: z.number().int().positive(),
  referencia_id: z.string().min(1).max(100),
  justificativa: z.string().min(1).max(1000),
  nome: z.string().min(1).max(200),
  dtcriacao: z.string().min(1).max(100),
});

export type Rci = z.infer<typeof RciSchema>;
export type RciCreate = z.infer<typeof RciCreateSchema>;
export type RciUpdate = z.infer<typeof RciUpdateSchema>;
export type RciFinalize = z.infer<typeof RciFinalizeSchema>;
export type RciLog = z.infer<typeof RciLogSchema>;
