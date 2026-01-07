import { z } from "zod";

import { useEffect, useState } from "react";

import style from "./style.module.css";

import { type RciCreate, RciCreateSchema } from "../../schemas/rciSchemas";

import { useAuthStore } from "../../stores/useAuthStore";
import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";

import PageTitle from "../../components/page-title/PageTitle";
import BaseButton from "../../components/buttons/BaseButton";
import SelectItemForm from "../../components/select-item-form/SelectItemForm";
import type { UnidadeSetor } from "../../schemas/stateSchemas";
import InputForm from "../../components/input-form/InputForm";
import { getNextMonth } from "../../utils/dateUtil";

export default function NovoRci({ onClose }: { onClose?: () => void }) {
  const colaborador = useAuthStore((state) => state.colaborador);
  const createRci = useRcisStore((state) => state.createRci);
  const showToast = useAppStore((state) => state.showToast);
  const getSetoresByUnidade = useAppStore((state) => state.getSetoresByUnidade);

  const unidades = useAppStore((state) => state.unidades);
  const condicoesInseguras = useAppStore((state) => state.condicoesInseguras);
  const niveisDeRisco = useAppStore((state) => state.niveisDeRisco);
  const setoresUnidade = useAppStore((state) => state.setoresUnidade);

  const [isSaving, setIsSaving] = useState(false);
  const [selectedSetor, setSelectedSetor] = useState<UnidadeSetor | null>(null);
  const [newRciData, setNewRciData] = useState<RciCreate>({
    autor_id: colaborador?.id || 0,
    unidade_id: 0,
    setor_id: 0,
    condicao_insegura_id: 0,
    nivel_risco_id: 0,
    status: "Aberto",
    tipo: "0",
    link_plano_acao: "",
    data_limite: getNextMonth(),
    detalhamento: "",
    solucao: undefined,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      RciCreateSchema.parse(newRciData);
      console.log("Creating RCI with data:", newRciData);
      await createRci(newRciData).then(() => {
        showToast("RCI criado com sucesso!", "success");
        onClose?.();
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

  const handleUnidadeChange = async (unidadeId: number | null) => {
    if (!unidadeId) {
      return;
    }
    setNewRciData((prev) => ({
      ...prev,
      unidade_id: unidadeId,
      setor_id: 0, // Reset setor_id when unidade changes
    }));
    setSelectedSetor(null);
    await getSetoresByUnidade(unidadeId.toString());
  };

  const handleSetorChange = (setorId: number | null) => {
    setNewRciData((prev) => ({
      ...prev,
      setor_id: setorId || 0,
    }));
    const setor = setoresUnidade.find((s) => s.id === setorId) || null;
    setSelectedSetor(setor);
  };

  const handleTipoChange = (tipo: "0" | "1") => {
    setNewRciData((prev) => ({
      ...prev,
      tipo: prev.tipo === tipo ? prev.tipo : tipo,
    }));
  };

  // Fetch setores whenever unidade changes
  useEffect(() => {
    const fetchSetores = async () => {
      if (newRciData.unidade_id !== 0) {
        await getSetoresByUnidade(newRciData.unidade_id.toString());
      }
    };

    fetchSetores();
  }, [newRciData.unidade_id, getSetoresByUnidade]);

  return (
    <div className={style.novoRciContent}>
      <header className={style.novoRciHeader}>
        <PageTitle
          title="Novo RCI"
          subtitle="Cadastre aqui uma nova ocorrência."
        />
      </header>
      <main className={style.novoRciMain}>
        <div className={style.novoRciForm}>
          <SelectItemForm
            label="Unidade"
            items={unidades.map((u) => ({ id: u.id, descricao: u.sigla }))}
            placeholder="Selecione a unidade"
            value={
              newRciData.unidade_id
                ? {
                    id: newRciData.unidade_id,
                    descricao:
                      unidades.find((u) => u.id === newRciData.unidade_id)
                        ?.sigla || "",
                  }
                : null
            }
            onChange={(e) => handleUnidadeChange(e?.id || null)}
          />
          <SelectItemForm
            label="Setor"
            items={setoresUnidade.map((n) => ({
              id: n.id,
              descricao: n.setor.nome,
            }))}
            placeholder="Selecione o setor"
            value={
              newRciData.setor_id
                ? {
                    id: newRciData.setor_id,
                    descricao:
                      setoresUnidade.find((s) => s.id === newRciData.setor_id)
                        ?.setor.nome || "",
                  }
                : null
            }
            onChange={(e) => handleSetorChange(e?.id || null)}
            disabled={
              newRciData.unidade_id === 0 || setoresUnidade.length === 0
            }
          />
          <InputForm
            label="Responsável"
            value={selectedSetor?.responsavel.first_name || ""}
            setValue={() => {}}
            disabled={true}
            rows={1}
            required
            placeholder="Responsável pela ocorrência"
          />
          <div className={style.tipoContainer}>
            <span className={style.buttonGroupLabel}>Tipo da Ocorrência</span>
            <div className={style.buttonGroup}>
              <button
                onClick={() => handleTipoChange("0")}
                className={`${style.typeButton} ${
                  newRciData.tipo === "0" ? style.typeButtonSelected : ""
                }`}
              >
                Condição Insegura
              </button>
              <button
                onClick={() => handleTipoChange("1")}
                className={`${style.typeButton} ${
                  newRciData.tipo === "1" ? style.typeButtonSelected : ""
                }`}
              >
                Quase Acidente
              </button>
            </div>
          </div>
        </div>
        <div className={style.novoRciForm}>
          <SelectItemForm
            label="Nível de Risco"
            items={niveisDeRisco.map((n) => ({
              id: n.id,
              descricao: `${n.sigla_risco} - ${n.severidade}`,
            }))}
            placeholder="Selecione a severidade"
            value={
              newRciData.nivel_risco_id
                ? {
                    id: newRciData.nivel_risco_id,
                    descricao:
                      niveisDeRisco.find(
                        (n) => n.id === newRciData.nivel_risco_id
                      )?.severidade || "",
                  }
                : null
            }
            onChange={(e) =>
              setNewRciData((prev) => ({
                ...prev,
                nivel_risco_id: e?.id || 0,
              }))
            }
          />
          <SelectItemForm
            label="Ocorrência"
            items={condicoesInseguras.map((n) => ({
              id: n.id,
              descricao: n.nome,
            }))}
            placeholder="Selecione a ocorrência"
            value={
              newRciData.condicao_insegura_id
                ? {
                    id: newRciData.condicao_insegura_id,
                    descricao:
                      condicoesInseguras.find(
                        (c) => c.id === newRciData.condicao_insegura_id
                      )?.nome || "",
                  }
                : null
            }
            onChange={(e) =>
              setNewRciData((prev) => ({
                ...prev,
                condicao_insegura_id: e?.id || 0,
              }))
            }
          />
          <InputForm
            label="Detalhes da Ocorrência"
            value={newRciData.detalhamento}
            setValue={(value) =>
              setNewRciData((prev) => ({
                ...prev,
                detalhamento: value,
              }))
            }
            rows={5}
            required
            placeholder="Descreva a ocorrência em detalhes"
          />
        </div>
      </main>
      <footer className={style.novoRciFooter}>
        <BaseButton
          label="Salvar o RCI"
          onClick={handleSave}
          disabled={isSaving}
        />
      </footer>
    </div>
  );
}
