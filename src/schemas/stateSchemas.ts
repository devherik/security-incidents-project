import { z } from "zod";

import { colaboradorSchema } from "./colaboradorSchema";
import { severidadeEnum } from "./enums";

export const unidadeSchema = z.object({
  id: z.number().int().positive(),
  gstor: colaboradorSchema,
  sigla: z.string().min(1).max(10),
  nome: z.string().min(1).max(100),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const setorSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1).max(100),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const unidadeSetorSchema = z.object({
  id: z.number().int().positive(),
  unidade: unidadeSchema,
  setor: setorSchema,
  responsavel: colaboradorSchema, // quem responde pelo setor na unidade
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const condicaoInsegurancaSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1).max(250),
  categoria: z.string().min(1).max(100),
  palavra_chave: z.string().min(1).max(50),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export const nivelRiscoSchema = z.object({
  id: z.number().int().positive(),
  sigla_risco: z.string().min(1).max(10),
  severidade: severidadeEnum,
  risco: z.string().min(1).max(250),
  acidente_pessoal: z.string().min(1).max(250),
  ativo: z.boolean().default(true),
  dtcriacao: z.date().default(() => new Date()),
  dtmodificacao: z.date().default(() => new Date()),
});

export type Unidade = z.infer<typeof unidadeSchema>;
export type Setor = z.infer<typeof setorSchema>;
export type UnidadeSetor = z.infer<typeof unidadeSetorSchema>;
export type CondicaoInseguranca = z.infer<typeof condicaoInsegurancaSchema>;
export type NivelRisco = z.infer<typeof nivelRiscoSchema>;
