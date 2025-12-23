/**
 * =============================================================================
 * EXCEL IMPORT MODAL COMPONENT
 * =============================================================================
 *
 * Modal for importing TarefasMaster from Excel files.
 *
 * WORKFLOW:
 * 1. User selects Cargo (required - context for import)
 * 2. User uploads Excel file
 * 3. File is validated and parsed
 * 4. Preview shows success/error summary
 * 5. User confirms to persist valid rows
 *
 * RESPONSIBILITIES:
 * - File input handling
 * - Cargo selection
 * - Preview validation results
 * - Trigger store import action
 */

import { useState, useRef, useCallback } from "react";

import styles from "./style.module.css";
import { useCargosStore } from "../../stores/useCargosStore";
import { useTarefasManagementStore } from "../../stores/useTarefasManagementStores";
import { useAppStore } from "../../stores/useAppStateStore";
import { useAuthStore } from "../../stores/useAuthStore";
import importIcon from "../../assets/icons/import-white.svg";
import Modal from "../modal/Modal";
import SelectItemForm from "../select-item-form/SelectItemForm";
import Loader from "../loader/Loader";
import XlsxAdapter from "../../adapters/XlsxAdapter";
import type { Cargo } from "../../schemas/schemas";
import PageTitle from "../page-title/PageTitle";

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExcelImportModal({
  isOpen,
  onClose,
}: ExcelImportModalProps) {
  const { showToast } = useAppStore();
  const { cargos } = useCargosStore();
  const colaborador = useAuthStore((state) => state.colaborador);
  const { importTarefasFromExcel, isLoading } = useTarefasManagementStore();

  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<{
    successCount: number;
    errorCount: number;
    errors: Array<{ row: number; errors: string[] }>;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setImportPreview(null); // Clear previous preview
      }
    },
    []
  );

  const handleValidate = useCallback(async () => {
    if (!selectedFile || !selectedCargo) {
      showToast("Selecione o cargo e o arquivo", "error");
      return;
    }

    try {
      // Validate file without persisting
      const result = await useTarefasManagementStore
        .getState()
        .validateExcelFile(
          selectedFile,
          selectedCargo.id,
          colaborador?.id ?? 0
        );

      setImportPreview({
        successCount: result.success.length,
        errorCount: result.errors.length,
        errors: result.errors.map((e) => ({
          row: e.row,
          errors: e.errors,
        })),
      });

      if (result.errors.length === 0) {
        showToast(
          `${result.success.length} tarefas válidas prontas para importar`,
          "success"
        );
      } else {
        showToast(
          `${result.success.length} válidas, ${result.errors.length} com erros`,
          "warning"
        );
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao validar arquivo",
        "error"
      );
    }
  }, [selectedFile, selectedCargo, showToast, colaborador?.id]);

  const handleImport = useCallback(async () => {
    if (!selectedFile || !selectedCargo) {
      showToast("Selecione o cargo e o arquivo", "error");
      return;
    }

    try {
      const result = await importTarefasFromExcel(
        selectedFile,
        selectedCargo.id,
        colaborador?.id ?? 0
      );

      if (result.errors.length === 0) {
        showToast(
          `${result.success.length} tarefas importadas com sucesso!`,
          "success"
        );
        onClose();
        // Reset state
        setSelectedFile(null);
        setSelectedCargo(null);
        setImportPreview(null);
      } else {
        showToast(
          `${result.success.length} importadas, ${result.errors.length} falharam`,
          "warning"
        );
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao importar tarefas",
        "error"
      );
    }
  }, [
    selectedFile,
    selectedCargo,
    importTarefasFromExcel,
    showToast,
    onClose,
    colaborador?.id,
  ]);

  const handleCargoChange = useCallback(
    (item: { descricao?: string; id: string | number } | null) => {
      const cargo = item
        ? cargos.find((c) => c.id === Number(item.id)) || null
        : null;
      setSelectedCargo(cargo);
      setImportPreview(null); // Clear preview when cargo changes
    },
    [cargos]
  );

  const handleDownloadTemplate = useCallback(() => {
    try {
      const templateData = [
        {
          Nome: "Exemplo: Revisar emails",
          Descrição: "Verificar inbox diariamente",
          Frequência: "diaria",
          DiaSemana: "seg, ter, qua, qui, sex",
          Semana: "",
          DataReferencia: "",
          "Tempo Estimado (min)": 30,
          Observação: "Executar pela manhã",
          Instruções: "Tarefa diária pode conter múltiplos dias da semana separados por vírgula.",
        },
        {
          Nome: "Exemplo: Reunião semanal",
          Descrição: "Alinhamento com a equipe",
          Frequência: "semanal",
          DiaSemana: "sex",
          Semana: "",
          DataReferencia: "",
          "Tempo Estimado (min)": 60,
          Observação: "Toda segunda-feira",
          Instruções: "Tarefa semanal deve especificar o dia da semana.",
        },
        {
          Nome: "Exemplo: Relatório mensal",
          Descrição: "Elaborar relatório de desempenho",
          Frequência: "mensal",
          DiaSemana: "seg",
          Semana: "primeira",
          DataReferencia: "",
          "Tempo Estimado (min)": 120,
          Observação: "",
          Instruções: "Tarefa mensal deve indicar o dia da semana e a semana do mês (primeira, segunda, terceira, quarta, última).",
        },
        {
          Nome: "Exemplo: Auditoria trimestral",
          Descrição: "Revisar processos internos",
          Frequência: "trimestral",
          DiaSemana: "",
          Semana: "",
          DataReferencia: "2025-12-09",
          "Tempo Estimado (min)": 180,
          Observação: "No final de cada trimestre",
          Instruções: "Tarefa trimestral deve indicar o dia referência para início.",
        },
        {
          Nome: "Exemplo: Backup de dados",
          Descrição: "Realizar backup completo",
          Frequência: "anual",
          DiaSemana: "",
          Semana: "",
          DataReferencia: "2025-12-31",
          "Tempo Estimado (min)": 240,
          Observação: "No final do ano fiscal",
          Instruções: "Tarefa anual deve indicar o dia referência para execução.",
        }
      ];

      XlsxAdapter.exportToExcel(
        templateData,
        [
          { header: "Nome", accessor: (item) => item.Nome },
          { header: "Descrição", accessor: (item) => item.Descrição },
          { header: "Frequência", accessor: (item) => item.Frequência },
          { header: "Dia(s) da Semana", accessor: (item) => item.DiaSemana },
          { header: "Semana", accessor: (item) => item.Semana },
          { header: "Data de Referência", accessor: (item) => item.DataReferencia },
          {
            header: "Tempo Estimado (min)",
            accessor: (item) => item["Tempo Estimado (min)"],
          },
          { header: "Observação", accessor: (item) => item.Observação },
          { header: "Instruções", accessor: (item) => item.Instruções },
        ],
        "tarefas-cargo-template"
      );

      showToast("Template baixado com sucesso!", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao baixar template",
        "error"
      );
    }
  }, [showToast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isBlur={true} position="center">
      <div className={styles.container}>
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <PageTitle
            title="Importar Tarefas do Excel"
            subtitle="Importe de um arquivo com as tarefas de um cargo específico."
          />
        </div>

        {/* Download Template Button */}
        <div className={styles.templateSection}>
          <p className={styles.templateText}>
            Não tem um arquivo? Baixe o template e preencha com suas tarefas.
          </p>
          <button
            onClick={handleDownloadTemplate}
            className={styles.templateButton}
            type="button"
          >
            <img src={importIcon} alt="Exportar" className={styles.icon} />{" "}
            Baixar Template
          </button>
        </div>

        <div className={styles.form}>
          {/* Cargo Selection */}
          <div className={styles.field}>
            <SelectItemForm
              label="Cargo"
              required
              items={cargos.map((c) => ({ id: c.id, descricao: c.nome }))}
              onChange={handleCargoChange}
              value={
                selectedCargo
                  ? { id: selectedCargo.id, descricao: selectedCargo.nome }
                  : null
              }
              placeholder="Selecione o cargo"
            />
          </div>

          {/* File Input */}
          <div className={styles.field}>
            <label className={styles.label}>Arquivo Excel *</label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
            {selectedFile && (
              <p className={styles.fileName}>
                Arquivo: <strong>{selectedFile.name}</strong>
              </p>
            )}
          </div>

          {/* Validation Preview */}
          {importPreview && (
            <div className={styles.preview}>
              <h3 className={styles.previewTitle}>Resultado da Validação</h3>
              <div className={styles.previewStats}>
                <span className={styles.success}>
                  ✓ {importPreview.successCount} válidas
                </span>
                <span className={styles.error}>
                  ✗ {importPreview.errorCount} com erros
                </span>
              </div>

              {importPreview.errors.length > 0 && (
                <div className={styles.errorList}>
                  <h4>Erros Encontrados:</h4>
                  <ul>
                    {importPreview.errors.slice(0, 10).map((err, idx) => (
                      <li key={idx}>
                        <strong>Linha {err.row}:</strong>{" "}
                        {err.errors.join(", ")}
                      </li>
                    ))}
                    {importPreview.errors.length > 10 && (
                      <li className={styles.moreErrors}>
                        ... e mais {importPreview.errors.length - 10} erros
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              onClick={handleValidate}
              disabled={!selectedFile || !selectedCargo || isLoading}
              className={styles.validateButton}
            >
              {isLoading ? <Loader size={20} /> : "Validar Arquivo"}
            </button>

            <button
              onClick={handleImport}
              disabled={
                !importPreview || importPreview.successCount === 0 || isLoading
              }
              className={styles.importButton}
            >
              {isLoading ? (
                <Loader size={20} />
              ) : (
                `Importar ${importPreview?.successCount || 0} Tarefas`
              )}
            </button>

            <button
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
