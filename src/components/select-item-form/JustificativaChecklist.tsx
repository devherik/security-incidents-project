import { useMemo, useState } from "react";

import styles from "./style.module.css";
import { useJustificativasStore } from "../../stores/useJustificativaStore";

interface JustificativaChecklistProps {
  label?: string;
  selectedIds: number[];
  onToggle: (id: number) => void;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
}

export default function JustificativaChecklist({
  label = "",
  selectedIds,
  onToggle,
  disabled = false,
  searchPlaceholder = "Selecione justificativas dessa tarefa...",
  emptyText = "Nenhuma justificativa encontrada",
}: JustificativaChecklistProps) {
  const justificativas = useJustificativasStore(
    (state) => state.justificativas
  );
  const isLoadingJustificativas = useJustificativasStore(
    (state) => state.isLoading
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return justificativas.filter((item) =>
      item.motivo?.toLowerCase().includes(normalizedSearch)
    );
  }, [justificativas, searchTerm]);

  const handleChange = (id: number | string) => {
    if (disabled) return;
    onToggle(Number(id));
  };

  if (isLoadingJustificativas) {
    return <div className={styles.container}>Carregando justificativas...</div>;
  }

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.checklistWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchTerm}
          disabled={disabled}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <ul className={styles.checkboxList}>
          {filteredItems.length === 0 ? (
            <li className={styles.checkboxEmptyState}>{emptyText}</li>
          ) : (
            filteredItems.map((item) => (
              <li key={item.id} className={styles.checkboxItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    disabled={disabled}
                    checked={selectedIds.includes(Number(item.id))}
                    onChange={() => handleChange(item.id)}
                  />
                  <span>{item.motivo}</span>
                </label>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
