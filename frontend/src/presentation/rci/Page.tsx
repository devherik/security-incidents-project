import { z } from "zod";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./style.module.css";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import NavigateButton from "../../components/buttons/NavigateButton";
import SelectItemForm from "../../components/select-item-form/SelectItemForm";
import InputForm from "../../components/input-form/InputForm";
import BaseButton from "../../components/buttons/BaseButton";
import SelectStatusForm from "../../components/select-status-form/SelectStatusForm";
import DatePicker from "../../components/date-picker/DatePicker";

import type {
  Rci,
  RciLog,
  RciUpdate,
  RciFinalize,
} from "../../schemas/rciSchemas";
import { RciUpdateSchema, RciFinalizeSchema } from "../../schemas/rciSchemas";

import { formatDateToISO } from "../../utils/dateUtil";

import deleteIcon from "../../assets/icons/delete.svg";

import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";
import Modal from "../../components/modal/Modal";
import PageTitle from "../../components/page-title/PageTitle";
import usePermissions from "../../hooks/usePermissions";

export default function RciPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { hasGroup } = usePermissions();

  const updateRci = useRcisStore((state) => state.updateRci);
  const deleteRci = useRcisStore((state) => state.deleteRci);
  const [rciLogs, setRciLogs] = useState<RciLog[]>([]);
  const showToast = useAppStore((state) => state.showToast);
  const getSetoresByUnidade = useAppStore((state) => state.getSetoresByUnidade);

  const unidades = useAppStore((state) => state.unidades);
  const condicoesInseguras = useAppStore((state) => state.condicoesInseguras);
  const niveisDeRisco = useAppStore((state) => state.niveisDeRisco);
  const setoresUnidade = useAppStore((state) => state.setoresUnidade);

  const rci: Rci = location.state?.rci;

  const [newRciData, setNewRciData] = useState<RciUpdate>(() => ({
    id: rci?.id || 0,
    autor_id: rci?.autor.id || 0,
    unidade_id: rci?.unidade.id || 0,
    status: rci?.status || "Aberto",
    link_plano_acao: rci?.link_plano_acao || "",
    data_limite: rci?.data_limite
      ? rci.data_limite.toISOString().split("T")[0]
      : undefined,
    setor_id: rci?.setor.id || 0,
    condicao_insegura_id: rci?.condicao_insegura.id || 0,
    nivel_risco_id: rci?.nivel_risco.id || 0,
    detalhamento: rci?.detalhamento || "",
    justificativa: "",
  }));

  const [solucao, setSolucao] = useState<string>(rci?.solucao || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFinishing, setIsFinishing] = useState(!hasGroup(1) ? false : true);

  // Derive selectedSetor to avoid frequent re-renders through extra state updates
  const selectedSetor = useMemo(() => {
    if (!rci) return null;
    if (newRciData.setor_id === rci.setor.id) return rci.setor;
    return (
      setoresUnidade.find((s) => s.id === Number(newRciData.setor_id)) || null
    );
  }, [setoresUnidade, newRciData.setor_id, rci]);

  const handleUpdateRci = async () => {
    if (!rci) return;
    setIsUpdating(true);
    try {
      console.log("Tentando atualizar o RCI...", newRciData);
      RciUpdateSchema.parse(newRciData);
      await updateRci(rci.id.toString(), newRciData);
      showToast("RCI atualizado com sucesso!", "success");
      setHasChanges(false);
      navigate(-1);
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
      setIsUpdating(false);
    }
  };

  const handleFinishRci = async () => {
    if (!rci) return;
    setIsUpdating(true);
    try {
      const rciToFinalize: RciFinalize = {
        id: rci.id,
        status: newRciData.status,
        solucao: solucao,
      };
      console.log("Tentando atualizar o RCI...", rciToFinalize);
      RciFinalizeSchema.parse(rciToFinalize);
      await updateRci(rci.id.toString(), rciToFinalize);
      showToast("RCI atualizado com sucesso!", "success");
      setHasChanges(false);
      navigate(-1);
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
      setIsUpdating(false);
    }
  };

  const handleDeleteRci = async () => {
    if (!rci) return;
    setIsUpdating(true);
    try {
      await deleteRci(rci.id.toString());
      showToast("RCI deletado com sucesso!", "success");
      navigate(-1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      showToast(`Erro ao deletar RCI: ${errorMessage}`, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (field: keyof RciUpdate, value: unknown) => {
    if (!rci) return;
    if (field === "status") {
      if (value === "Finalizado" || value === "Rejeitado") {
        setIsFinishing(true);
      } else {
        setIsFinishing(false);
      }
    }
    setHasChanges(true);
    setNewRciData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (rci?.unidade.id) {
      getSetoresByUnidade(rci.unidade.id.toString());
    }
  }, [rci?.unidade.id, getSetoresByUnidade]);

  useEffect(() => {
    if (rci?.id) {
      useRcisStore
        .getState()
        .fetchRciHistory(rci.id.toString())
        .then(setRciLogs)
        .catch((err) => console.error("Failed to fetch RCI logs:", err));
    }
  }, [rci?.id]);

  if (!rci) {
    return (
      <div className={style.container}>
        <SlideInEffect duration={0.5}>
          <header className={style.header}>
            <NavigateButton
              direction="left"
              path="/dashboard"
              alt="Voltar para o dashboard"
            />
          </header>
          <main className={style.main}>
            <h1 className="mb-4 text-2xl font-bold">Não encontramos o RCI.</h1>
          </main>
        </SlideInEffect>
      </div>
    );
  }

  if (rci) {
    return (
      <>
        <div className={style.container}>
          <SlideInEffect duration={0.5}>
            <header className={style.header}>
              <NavigateButton
                direction="left"
                path="/dashboard"
                alt="Voltar para o dashboard"
              />
            </header>
            <main className={style.main}>
              <div className={style.cabecalho}>
                <div>
                  <h1 className="text-2xl font-bold ">
                    {rci.tipo === "0" ? "Condição Insegura" : "Quase Acidente"}{" "}
                    #{rci.id}
                  </h1>
                  <p>
                    Criado por {rci.autor.first_name} em{" "}
                    {formatDateToISO(rci.dtcriacao)}
                  </p>
                </div>
                {!hasGroup(1) && (
                  <div className="flex flex-row items-center gap-4">
                    <SelectStatusForm
                      value={newRciData.status}
                      onChange={(newStatus) => {
                        if (
                          (newStatus === "Finalizado" ||
                            newStatus === "Rejeitado") &&
                          hasChanges
                        ) {
                          showToast(
                            "Você tem alterações não salvas.",
                            "warning"
                          );
                          return;
                        }
                        handleChange("status", newStatus || "Aberto");
                      }}
                    />
                    <button
                      className={style.deleteButton}
                      title="Deletar RCI"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <img src={deleteIcon} alt="Deletar RCI" />
                    </button>
                  </div>
                )}
              </div>
              <div className={style.info}>
                <div className={style.form}>
                  <div className="grid grid-cols-2 gap-1.5">
                    <SelectItemForm
                      label="Unidade"
                      items={unidades.map((u) => ({
                        id: u.id,
                        descricao: u.sigla,
                      }))}
                      placeholder="Selecione a unidade"
                      value={{
                        id: rci.unidade.id,
                        descricao: rci.unidade.sigla,
                      }}
                      onChange={() => {}}
                      disabled={true}
                    />
                    <SelectItemForm
                      label="Setor"
                      items={setoresUnidade.map((n) => ({
                        id: n.id,
                        descricao: n.setor.nome,
                      }))}
                      placeholder="Selecione o setor"
                      value={
                        selectedSetor
                          ? {
                              id: selectedSetor.id,
                              descricao: selectedSetor.setor.nome,
                            }
                          : null
                      }
                      onChange={(e) => handleChange("setor_id", e?.id || 0)}
                      disabled={isFinishing}
                    />
                    <InputForm
                      label="Responsável"
                      value={""}
                      setValue={() => {}}
                      disabled={true}
                      rows={1}
                      required
                      placeholder={selectedSetor?.responsavel.first_name || ""}
                    />
                    <SelectItemForm
                      label="Grau de Risco"
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
                        handleChange("nivel_risco_id", e?.id || 0)
                      }
                      disabled={isFinishing}
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
                                  (c) =>
                                    c.id === newRciData.condicao_insegura_id
                                )?.nome || "",
                            }
                          : null
                      }
                      onChange={(e) =>
                        handleChange("condicao_insegura_id", e?.id || 0)
                      }
                      disabled={isFinishing}
                    />
                    <DatePicker
                      value={newRciData.data_limite || ""}
                      label="Data Limite"
                      onChange={(date) => {
                        if (!date) return;
                        const newDate = new Date(date)
                          .toISOString()
                          .split("T")[0];
                        handleChange("data_limite", newDate);
                      }}
                      disabled={isFinishing}
                    />
                  </div>
                  <InputForm
                    label="Link do Plano de Ação"
                    value={newRciData.link_plano_acao || ""}
                    setValue={(value) => handleChange("link_plano_acao", value)}
                    rows={1}
                    required={false}
                    placeholder="Cole o link aqui"
                    disabled={isFinishing}
                  />
                  <InputForm
                    label="Detalhes da Ocorrência"
                    value={newRciData.detalhamento}
                    setValue={(value) => handleChange("detalhamento", value)}
                    rows={5}
                    required
                    placeholder="Descreva a ocorrência em detalhes"
                    disabled={isFinishing}
                  />
                </div>
                <div className={style.history}>
                  <h2 className="mb-4 text-xl font-bold">Histórico do RCI</h2>
                  {rciLogs.length === 0 ? (
                    <p>Nenhum histórico disponível para este RCI.</p>
                  ) : (
                    <ul>
                      {rciLogs.map((log) => (
                        <li key={log.id} className="mb-2">
                          <p className="font-semibold">
                            {log.nome} - {log.dtcriacao.split("T")[0]}
                          </p>
                          <p>{log.justificativa}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <footer className={style.footer}>
                {!hasGroup(1) && (
                  <BaseButton
                    label={isFinishing ? "Finalizar RCI" : "Salvar o RCI"}
                    onClick={() => setIsModalOpen(true)}
                    disabled={!hasChanges || isUpdating}
                  />
                )}
              </footer>
            </main>
          </SlideInEffect>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isBlur={true}
        >
          <div className={style.modalContent}>
            <PageTitle
              title={isFinishing ? "Finalizar RCI" : "Alterações Salvas"}
            />
            <main>
              {isFinishing ? (
                <div className="flex flex-col gap-4">
                  <p>Tem certeza que deseja finalizar este RCI?</p>
                  <InputForm
                    value={solucao}
                    setValue={setSolucao}
                    rows={5}
                    required
                    placeholder="Descreva a solução adotada para este RCI"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p>Tem certeza que deseja salvar as alterações deste RCI?</p>
                  <InputForm
                    value={newRciData.justificativa || ""}
                    setValue={(value) => handleChange("justificativa", value)}
                    rows={5}
                    required
                    placeholder="Descreva a observação para esta alteração"
                  />
                </div>
              )}
            </main>
            <footer className="flex flex-row justify-end gap-4">
              <BaseButton
                label={
                  isFinishing ? "Confirmar Finalização" : "Confirmar Alterações"
                }
                onClick={() => {
                  if (isFinishing) {
                    if (solucao.trim().length < 15) {
                      showToast(
                        "A solução deve ter pelo menos 15 caracteres.",
                        "error"
                      );
                      return;
                    }
                    handleFinishRci();
                  } else {
                    if (newRciData.justificativa?.trim().length < 15) {
                      showToast(
                        "A observação deve ter pelo menos 15 caracteres.",
                        "error"
                      );
                      return;
                    }
                    handleUpdateRci();
                  }
                  setIsModalOpen(false);
                }}
              />
            </footer>
          </div>
        </Modal>
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          isBlur={true}
        >
          <div className={style.modalContent}>
            <PageTitle title={"Deletar RCI"} />
            <main className="flex flex-col">
              <p>Tem certeza que deseja deletar este RCI?</p>
            </main>
            <footer className="flex flex-row justify-end gap-4">
              <BaseButton
                isDelete={true}
                label={"Sim, deletar RCI"}
                onClick={() => {
                  handleDeleteRci();
                  setIsDeleteModalOpen(false);
                }}
              />
            </footer>
          </div>
        </Modal>
      </>
    );
  }
}
