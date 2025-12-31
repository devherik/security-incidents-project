/**
 * Excel Export Button Component
 *
 * Simple button component to trigger Excel export of current tarefas.
 * Can be placed anywhere in the UI to export the current filtered dataset.
 */

import { useRcisStore } from "../../stores/useRcisStore";
import { useAppStore } from "../../stores/useAppStore";

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
  filename = `rcis-${new Date().toISOString().split("T")[0]}`,
  variant = "outline",
  showIcon = true,
}: ExcelExportButtonProps) {
  const { exportRcisToExcel, filteredRcis } = useRcisStore();
  const { showToast } = useAppStore();

  const handleExport = () => {
    try {
      if (filteredRcis.length === 0) {
        showToast("Nenhuma tarefa para exportar", "warning");
        return;
      }

      exportRcisToExcel(filename);
      showToast(
        `${filteredRcis.length} RCIs exportadas com sucesso!`,
        "success"
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao exportar RCIs",
        "error"
      );
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={filteredRcis.length === 0}
      className={`${styles.exportButton} ${styles[variant]}`}
      title={filteredRcis.length === 0 ? "Nenhuma RCI disponível" : "Exportar"}
    >
      {showIcon && (
        <img src={exportIcon} alt="Exportar" className={styles.icon} />
      )}
      {label}
    </button>
  );
}
