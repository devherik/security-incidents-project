import { z } from "zod";

import { ColaboradorSchema } from "./colaboradorSchema";
import {
  UnidadeSetorSchema,
  UnidadeSchema,
  CondicaoInsegurancaSchema,
  NivelRiscoSchema,
} from "./stateSchemas";
import { rciStatusEnum } from "./enums";

export const RciSchema = z.object({
  id: z.number().int().positive(),
  autor: ColaboradorSchema,
  unidade: UnidadeSchema,
  setor: UnidadeSetorSchema,
  condicao_inseguranca: CondicaoInsegurancaSchema,
  nivel_risco: NivelRiscoSchema,
  data_limite: z.date(),
  status: rciStatusEnum,
  tipo: z.string().min(1).max(100),
  link_plano_acao: z.url().optional(),
  detalhamento: z.string().min(1).max(1000),
  solucao: z.string().min(1).max(1000).optional(),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const RciCreateSchema = RciSchema.omit({
  id: true,
  autor: true,
  dtcriacao: true,
  dtmodificacao: true,
  solucao: true,
});

export const RciUpdateSchema = RciSchema.pick({
  status: true,
  solucao: true,
  link_plano_acao: true,
  data_limite: true,
});

export type Rci = z.infer<typeof RciSchema>;
export type RciCreate = z.infer<typeof RciCreateSchema>;
export type RciUpdate = z.infer<typeof RciUpdateSchema>;