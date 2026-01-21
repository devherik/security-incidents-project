import React, { useState, useEffect, useCallback } from "react";
import { useRcisStore } from "../../stores/useRcisStore";
import style from "./style.module.css";
import closeIcon from "../../assets/icons/close.svg";

/**
 * SearchBar Component
 * 
 * Provides a debounced search input to filter RCIs by multiple fields.
 * Adheres to the Single Responsibility Principle by focusing only on 
 * capturing and debouncing the search term.
 */
export const SearchBar: React.FC = () => {
  const search = useRcisStore((state) => state.filters.search);
  const setFilter = useRcisStore((state) => state.setFilter);
  const applyFilters = useRcisStore((state) => state.applyFilters);

  const [localSearch, setLocalSearch] = useState(search);

  // Sync local state with store (e.g. when filters are cleared)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setFilter("search", localSearch);
        applyFilters();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, search, setFilter, applyFilters]);

  const handleClear = useCallback(() => {
    setLocalSearch("");
    setFilter("search", "");
    applyFilters();
  }, [setFilter, applyFilters]);

  return (
    <div className={style.searchContainer}>
      <svg 
        className={style.searchIcon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        className={style.searchInput}
        placeholder="Pesquisar por unidade, ocorrência, autor..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      {localSearch && (
        <button 
          className={style.clearButton} 
          onClick={handleClear}
          title="Limpar pesquisa"
        >
          <img src={closeIcon} alt="Clear" className={style.clearIcon} />
        </button>
      )}
    </div>
  );
};
