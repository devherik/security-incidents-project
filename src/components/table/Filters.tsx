import { useRcisStore } from "../../stores/useRcisStore";
import DateByRangePicker from "../date-picker/DateRangePicker";
import { SearchBar } from "../search-bar/SearchBar";

import style from "./style.module.css";

export default function Filters() {
  const filters = useRcisStore((state) => state.filters);
  const setFilter = useRcisStore((state) => state.setFilter);
  const clearFilters = useRcisStore((state) => state.clearFilters);

  return (
    <div className={style.filtersContainer}>
      <SearchBar />
      
      <DateByRangePicker
        onChange={(e) => {
          setFilter("periodo", { startDate: e.startDate, endDate: e.endDate });
        }}
        value={filters.periodo ?? { startDate: null, endDate: null }}
      />

      <button
        onClick={() => setFilter("ativo", !filters.ativo)}
        className={`${style.checkActive} ${filters.ativo ? style.active : ""}`}
      >
        Ativos
      </button>
      <button onClick={clearFilters} className={style.clearFiltersButton}>
        Limpar
      </button>
    </div>
  );
}
