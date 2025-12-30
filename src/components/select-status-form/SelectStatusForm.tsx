import { useState, useRef, useEffect } from "react";

import { type RciStatus } from "../../schemas/enums";

import styles from "./style.module.css";

interface SelectItemFormProps {
  value: RciStatus | "Aberto";
  onChange: (item: RciStatus | null) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectStatusForm({
  value,
  onChange,
  required = false,
  disabled = false,
}: SelectItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const items = ["Aberto", "Em Análise", "Concluído", "Cancelado"].filter(
    (item) => item.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <label className={styles.label}>
        Status
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.selectWrapper}>
        <div
          className={`${styles.selectDisplay} ${
            disabled ? styles.disabled : ""
          }`}
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
                    }`}
                    onClick={() => handleSelectItem(item as RciStatus)}
                  >
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
