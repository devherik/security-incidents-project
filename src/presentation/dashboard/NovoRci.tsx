import { z } from "zod";

import { useState } from "react";

import style from "./style.module.css";

import { type RciCreate, RciCreateSchema } from "../../schemas/rciSchemas";

import { useAuthStore } from "../../stores/useAuthStore";
import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";

export default function NovoRci({ onClose }: { onClose?: () => void }) {
  const { colaborador } = useAuthStore();
  const { showToast } = useAppStore();
  const createRci = useRcisStore((state) => state.createRci);

  const [isSaving, setIsSaving] = useState(false);
  const [newRciData, setNewRciData] = useState<RciCreate>({
    autor_id: colaborador?.id || 0,
    unidade_id: 0,
    setor_id: 0,
    condicao_insegura_id: 0,
    nivel_risco_id: 0,
    status: "Aberto",
    tipo: "",
    link_plano_acao: undefined,
    detalhamento: "",
    solucao: undefined,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      RciCreateSchema.parse(newRciData);
      await createRci(newRciData).then(() => {
        showToast("RCI criado com sucesso!", "success");
        onClose();
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast(
          error.issues.map((issue) => issue.message).join(", "),
          "error"
        );
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        showToast(`Erro ao criar RCI: ${errorMessage}`, "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return <div className={style.novoRciContent}></div>;
}
