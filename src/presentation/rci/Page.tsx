import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./style.module.css";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import NavigateButton from "../../components/buttons/NavigateButton";
import SelectItemForm from "../../components/select-item-form/SelectItemForm";
import InputForm from "../../components/input-form/InputForm";

import type { Rci, RciLog, RciUpdate } from "../../schemas/rciSchemas";
import type { UnidadeSetor } from "../../schemas/stateSchemas";
import { RciUpdateSchema } from "../../schemas/rciSchemas";

import { formatDateToISO } from "../../utils/dateUtil";

import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";
import BaseButton from "../../components/buttons/BaseButton";

export default function RciPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const updateRci = useRcisStore((state) => state.updateRci);
  const [rciLogs, setRciLogs] = useState<RciLog[]>([]);
  const showToast = useAppStore((state) => state.showToast);
  const getSetoresByUnidade = useAppStore((state) => state.getSetoresByUnidade);

  const unidades = useAppStore((state) => state.unidades);
  const condicoesInseguras = useAppStore((state) => state.condicoesInseguras);
  const niveisDeRisco = useAppStore((state) => state.niveisDeRisco);
  const setoresUnidade = useAppStore((state) => state.setoresUnidade);

  const rci: Rci = location.state?.rci;

  const [selectedSetor, setSelectedSetor] = useState<UnidadeSetor | null>(
    rci ? rci.setor : null
  );
  const [newRciData, setNewRciData] = useState<RciUpdate>({
    id: rci ? rci.id : 0,
    status: rci ? rci.status : "Aberto",
    link_plano_acao: rci ? rci.link_plano_acao || "" : "",
    data_limite: rci ? rci.data_limite : new Date(),
    solucao: rci ? rci.solucao || "" : "",
    setor_id: rci ? rci.setor.id : 0,
    condicao_insegura_id: rci ? rci.condicao_insegura.id : 0,
    nivel_risco_id: rci ? rci.nivel_risco.id : 0,
    detalhamento: rci ? rci.detalhamento : "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateRci = async () => {
    setIsUpdating(true);
    try {
      const parsedData = RciUpdateSchema.safeParse(newRciData);
      if (!parsedData.success) {
        showToast("Dados inválidos. Verifique os campos.", "error");
        return;
      }
      await updateRci(rci.id.toString(), parsedData.data).then(() => {
        showToast("RCI atualizado com sucesso!", "success");
        setHasChanges(false);
        navigate(-1);
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      showToast(`Erro ao criar RCI: ${errorMessage}`, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetorChange = (setorId: number | null) => {
    setHasChanges(true);

    // Ensure numeric comparison (SelectItem.id can be string | number)
    const numericSetorId = setorId ? Number(setorId) : 0;

    // Update newRciData with the new setor_id
    setNewRciData((prev) => ({
      ...prev,
      setor_id: numericSetorId,
    }));

    // Find and update selectedSetor from current setoresUnidade
    if (numericSetorId) {
      const setor = setoresUnidade.find((s) => s.id === numericSetorId);
      setSelectedSetor(setor || null);
    } else {
      setSelectedSetor(null);
    }
  };

  useEffect(() => {
    const fetchSetores = async () => {
      if (rci.unidade.id !== 0) {
        await getSetoresByUnidade(rci.unidade.id.toString());
      }
    };

    fetchSetores();
  }, [rci.unidade.id, getSetoresByUnidade]);

  // Sync selectedSetor whenever setoresUnidade changes or setor_id changes
  useEffect(() => {
    if (newRciData.setor_id && setoresUnidade.length > 0) {
      const setor = setoresUnidade.find(
        (s) => s.id === Number(newRciData.setor_id)
      );
      setSelectedSetor(setor || null);
    }
  }, [setoresUnidade, newRciData.setor_id]);

  useEffect(() => {
    const fetchRciLogs = async () => {
      try {
        const history = await useRcisStore
          .getState()
          .fetchRciHistory(rci.id.toString());
        setRciLogs(history);
      } catch (error) {
        console.error("Failed to fetch RCI logs:", error);
      }
    };

    fetchRciLogs();
  }, [rci.id]);

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
              <h1 className="text-2xl font-bold ">
                {rci.tipo === "0" ? "Condição Insegura" : "Quase Acidente"} #
                {rci.id}
              </h1>
              <p>
                Criado por {rci.autor.first_name} em{" "}
                {formatDateToISO(rci.dtcriacao)}
              </p>
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
                      newRciData.setor_id
                        ? {
                            id: newRciData.setor_id,
                            descricao:
                              setoresUnidade.find(
                                (s) => s.id === newRciData.setor_id
                              )?.setor.nome || "",
                          }
                        : null
                    }
                    onChange={(e) => handleSetorChange(e?.id || null)}
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
                </div>
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
          </main>
          <footer className={style.footer}>
            <BaseButton
              label="Salvar o RCI"
              onClick={handleUpdateRci}
              disabled={!hasChanges || isUpdating}
            />
          </footer>
        </SlideInEffect>
      </div>
    );
  }
}
