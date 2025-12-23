import { z } from "zod";

import { ColaboradorSchema } from "./colaboradorSchema";
import { severidadeEnum } from "./enums";

export const UnidadeSchema = z.object({
  id: z.number().int().positive(),
  gstor: ColaboradorSchema,
  sigla: z.string().min(1).max(10),
  nome: z.string().min(1).max(100),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const SetorSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1).max(100),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const UnidadeSetorSchema = z.object({
  id: z.number().int().positive(),
  unidade: UnidadeSchema,
  setor: SetorSchema,
  responsavel: ColaboradorSchema, // quem responde pelo setor na unidade
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const CondicaoInsegurancaSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1).max(250),
  categoria: z.string().min(1).max(100),
  palavra_chave: z.string().min(1).max(50),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const NivelRiscoSchema = z.object({
  id: z.number().int().positive(),
  sigla_risco: z.string().min(1).max(10),
  severidade: severidadeEnum,
  risco: z.string().min(1).max(250),
  acidente_pessoal: z.string().min(1).max(250),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export type Unidade = z.infer<typeof UnidadeSchema>;
export type Setor = z.infer<typeof SetorSchema>;
export type UnidadeSetor = z.infer<typeof UnidadeSetorSchema>;
export type CondicaoInseguranca = z.infer<typeof CondicaoInsegurancaSchema>;
export type NivelRisco = z.infer<typeof NivelRiscoSchema>;
