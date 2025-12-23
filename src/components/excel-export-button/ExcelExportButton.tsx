/**
 * Excel Export Button Component
 *
 * Simple button component to trigger Excel export of current tarefas.
 * Can be placed anywhere in the UI to export the current filtered dataset.
 */

import { useTarefasManagementStore } from "../../stores/useTarefasManagementStores";
import { useAppStore } from "../../stores/useAppStateStore";
import exportIcon from "../../assets/icons/export.svg";
import styles from "./style.module.css";

interface ExcelExportButtonProps {
  /** Custom label for the button */
  label?: string;
  /** Custom filename (without extension) */
  filename?: string;
  /** Button variant */
  variant?: "primary" | "secondary" | "outline";
  /** Show icon */
  showIcon?: boolean;
}

export default function ExcelExportButton({
  label = "Exportar",
  filename = `tarefas-master-${new Date().toISOString().split("T")[0]}`,
  variant = "outline",
  showIcon = true,
}: ExcelExportButtonProps) {
  const { exportTarefasToExcel, tarefas } = useTarefasManagementStore();
  const { showToast } = useAppStore();

  const handleExport = () => {
    try {
      if (tarefas.length === 0) {
        showToast("Nenhuma tarefa para exportar", "warning");
        return;
      }

      exportTarefasToExcel(filename);
      showToast(`${tarefas.length} tarefas exportadas com sucesso!`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao exportar tarefas",
        "error"
      );
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={tarefas.length === 0}
      className={`${styles.exportButton} ${styles[variant]}`}
      title={
        tarefas.length === 0
          ? "Nenhuma tarefa disponível"
          : "Exportar"
      }
    >
      {showIcon && (
        <img src={exportIcon} alt="Exportar" className={styles.icon} />
      )}
      {label}
    </button>
  );
}
