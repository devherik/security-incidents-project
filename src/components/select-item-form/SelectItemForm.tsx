import { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

export interface SelectItem {
  id: string | number;
  descricao?: string;
}

interface SelectItemFormProps<T extends SelectItem> {
  label?: string;
  items: T[];
  value: T | null;
  onChange: (item: T | null) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  noResultsText?: string;
}

export default function SelectItemForm<T extends SelectItem>({
  label = "",
  items,
  value,
  onChange,
  placeholder = "Search...",
  required = false,
  disabled = false,
  noResultsText = "Nenhum resultado encontrado",
}: SelectItemFormProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelectItem = (item: T) => {
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
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

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
            {value ? value.descricao : placeholder}
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
            <input
              type="text"
              className={styles.searchInput}
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />

            <ul className={styles.itemList}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className={`${styles.item} ${
                      value?.id === item.id ? styles.selectedItem : ""
                    }`}
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.descricao}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>{noResultsText}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
