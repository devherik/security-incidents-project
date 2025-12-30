import { useEffect, useMemo, useState } from "react";

import { useRcisStore } from "../../stores/useRcisStore";
import { useAuthStore } from "../../stores/useAuthStore";

import style from "./style.module.css";

import LoadingOverlay from "../loading-overlay/LoadingOverlay";
import Filters from "./Filters";
import Row from "./Row";
import Pagination from "./Pagination";

export default function Table() {
  const colaborador = useAuthStore((state) => state.colaborador);
  const rcis = useRcisStore((state) => state.filteredRcis);
  const pagination = useRcisStore((state) => state.pagination);
  const setPage = useRcisStore((state) => state.setPage);

  const [isLoading, setIsLoading] = useState(false);

  const paginatedRcis = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.per_page;
    return rcis.slice(startIndex, startIndex + pagination.per_page);
  }, [rcis, pagination.page, pagination.per_page]);

  useEffect(() => {
    const fetchRcisData = async () => {
      setIsLoading(true);
      if (colaborador) {
        try {
          await useRcisStore.getState().fetchRcis(colaborador.id.toString());
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load RCI data";
          console.error("RCI data fetch error:", errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRcisData();
  }, [colaborador]);

  return (
    <div className={style.tableContainer}>
      {/* Table filters, search, export and pagination */}

      <Filters />

      {/* Table content */}
      <LoadingOverlay isLoading={isLoading}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Unidade</th>
              <th>Grau de Risco</th>
              <th>Ocorrência</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Plano de Ação</th>
              <th>Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRcis.map((rci) => (
              <Row key={rci.id} rci={rci} />
            ))}
          </tbody>
        </table>
        <Pagination meta={pagination} onPageChange={setPage} />
      </LoadingOverlay>
    </div>
  );
}
