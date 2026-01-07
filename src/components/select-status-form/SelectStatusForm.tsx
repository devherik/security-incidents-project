import { useState, useRef, useEffect } from "react";

import { type RciStatus } from "../../schemas/enums";

import styles from "./style.module.css";

// Status color mapping for visual distinction
const statusColorMap: Record<string, string> = {
  Aberto: styles.statusAberto,
  "Em Análise": styles.statusEmAnalise,
  "Em Andamento": styles.statusEmAndamento,
  Finalizado: styles.statusFinalizado,
  Rejeitado: styles.statusRejeitado,
};

interface SelectItemFormProps {
  value: RciStatus | "Aberto";
  onChange: (item: RciStatus | null) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectStatusForm({
  value,
  onChange,
  disabled = false,
}: SelectItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const items = ["Aberto", "Em Análise", "Em Andamento", "Finalizado", "Rejeitado"].filter(
    (item) => item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the color class for a given status
  const getStatusColorClass = (status: string) => statusColorMap[status] || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItem = (item: RciStatus) => {
    onChange(item);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm("");
  };

  return (
    <div className={styles.container} ref={containerRef}>

      <div className={styles.selectWrapper}>
        <div
          className={`${styles.selectDisplay} ${
            disabled ? styles.disabled : ""
          } ${value ? getStatusColorClass(value) : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span
            className={value ? styles.selectedText : styles.placeholderText}
          >
            {value ? value : "Selecione o status"}
          </span>
          <div className={styles.icons}>
            {value && !disabled && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                aria-label="Clear selection"
              >
                ×
              </button>
            )}
            <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>
              ▼
            </span>
          </div>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <ul className={styles.itemList}>
              {items.length > 0 ? (
                items.map((item) => (
                  <li
                    key={item}
                    className={`${styles.item} ${
                      value === item ? styles.selectedItem : ""
                    } ${getStatusColorClass(item)}`}
                    onClick={() => handleSelectItem(item as RciStatus)}
                  >
                    <span className={styles.statusDot}></span>
                    {item}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
