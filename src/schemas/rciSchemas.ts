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
  data_limite: z.coerce.string(),
  status: rciStatusEnum,
  tipo: z.string().min(1).max(100),
  link_plano_acao: z.url().optional(),
  detalhamento: z.string().min(1).max(1000),
  solucao: z.string().min(1).max(1000).optional(),
  dtcriacao: z.coerce.date().default(() => new Date()),
  dtmodificacao: z.coerce.date().default(() => new Date()),
});

export const RciCreateSchema = z.object({
  autor_id: z.number().int().positive(),
  unidade_id: z.number().int().positive(),
  setor_id: z.number().int().positive(),
  condicao_insegura_id: z.number().int().positive(),
  nivel_risco_id: z.number().int().positive(),
  data_limite: z.coerce.string().default(() => getNextMonth()).optional(),
  status: rciStatusEnum.default("Aberto"),
  tipo: z.string().min(1).max(100),
  link_plano_acao: z.url().optional(),
  detalhamento: z.string().min(1).max(1000),
  solucao: z.string().min(1).max(1000).optional(),
});

export const RciUpdateSchema = RciCreateSchema.pick({
  setor_id: true,
  condicao_insegura_id: true,
  nivel_risco_id: true,
  detalhamento: true,
  status: true,
  solucao: true,
  link_plano_acao: true,
  data_limite: true,
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
export type RciLog = z.infer<typeof RciLogSchema>;