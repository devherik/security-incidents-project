import { z } from "zod";

import { colaboradorSchema } from "./colaboradorSchema";
import {
  unidadeSetorSchema,
  unidadeSchema,
  condicaoInsegurancaSchema,
  nivelRiscoSchema,
} from "./stateSchemas";
import { rciStatusEnum } from "./enums";

export const rciSchema = z.object({
  id: z.number().int().positive(),
  autor: colaboradorSchema,
  unidade: unidadeSchema,
  setor: unidadeSetorSchema,
  condicao_inseguranca: condicaoInsegurancaSchema,
  nivel_risco: nivelRiscoSchema,
  data_limite: z.date(),
  status: rciStatusEnum,
  tipo: z.string().min(1).max(100),
  link_plano_acao: z.url().optional(),
  detalhamento: z.string().min(1).max(1000),
  solucao: z.string().min(1).max(1000).optional(),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const rciCreateSchema = rciSchema.omit({
  id: true,
  autor: true,
  dtcriacao: true,
  dtmodificacao: true,
  solucao: true,
});

export const rciUpdateSchema = rciSchema.pick({
  status: true,
  solucao: true,
  link_plano_acao: true,
  data_limite: true,
});
