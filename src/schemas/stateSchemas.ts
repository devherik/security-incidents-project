import { z } from "zod";

import { ColaboradorSchema } from "./colaboradorSchema";
import { severidadeEnum } from "./enums";

export const UnidadeSchema = z.object({
  id: z.number().int().positive(),
  gestor: ColaboradorSchema,
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

export const CondicaoInseguraSchema = z.object({
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

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: z.array(dataSchema),
    meta: PaginationMetaSchema,
  });

export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  status_code: z.number().int(),
});

export const ImageMetadataSchema = z.object({
  filename: z.string().min(1),
  url: z.url(),
  altText: z.string().optional(),
});

export const ImageMetadataArraySchema = z.array(ImageMetadataSchema);

export type Unidade = z.infer<typeof UnidadeSchema>;
export type Setor = z.infer<typeof SetorSchema>;
export type UnidadeSetor = z.infer<typeof UnidadeSetorSchema>;
export type CondicaoInsegura = z.infer<typeof CondicaoInseguraSchema>;
export type NivelRisco = z.infer<typeof NivelRiscoSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;
