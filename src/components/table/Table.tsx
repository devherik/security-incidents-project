import { useEffect, useMemo, useState } from "react";

import { useRcisStore } from "../../stores/useRcisStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAppStore } from "../../stores/useAppStore";

import usePermissions from "../../hooks/usePermissions";

import style from "./style.module.css";

import LoadingOverlay from "../../animations/loading-overlay/LoadingOverlay";
import Filters from "./Filters";
import Row from "./Row";
import Pagination from "./Pagination";
import TableColumnFilter from "./table-column-filter/select-item-form/SelectItemForm";

export default function Table() {
  const colaborador = useAuthStore((state) => state.colaborador);
  const rcis = useRcisStore((state) => state.filteredRcis);
  const pagination = useRcisStore((state) => state.pagination);
  const setPage = useRcisStore((state) => state.setPage);

  const filters = useRcisStore((state) => state.filters);
  const setFilter = useRcisStore((state) => state.setFilter);

  const unidades = useAppStore((state) => state.unidades);
  const condicoesInseguras = useAppStore((state) => state.condicoesInseguras);
  const niveisDeRisco = useAppStore((state) => state.niveisDeRisco);
  const status = useAppStore((state) => state.status);

  const { hasGroup } = usePermissions();

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

      {!hasGroup(1) && <Filters />}

      {/* Table content */}
      <LoadingOverlay isLoading={isLoading}>
        <table className={style.table}>
          <thead>
            <tr>
              <th className={style.colUnidade}>
                <TableColumnFilter
                  items={unidades.map((u) => ({
                    id: u.id,
                    descricao: u.sigla,
                  }))}
                  placeholder="Unidade"
                  value={
                    filters.unidade
                      ? {
                          id: filters.unidade.id,
                          descricao: filters.unidade.sigla,
                        }
                      : null
                  }
                  onChange={(e) =>
                    setFilter(
                      "unidade",
                      unidades.find((u) => u.id === e?.id) || null
                    )
                  }
                />
              </th>
              <th className={style.colRisco}>
                <TableColumnFilter
                  items={niveisDeRisco.map((n) => ({
                    id: n.id,
                    descricao: `${n.sigla_risco} - ${n.severidade}`,
                  }))}
                  placeholder="Grau de Risco"
                  value={
                    filters.nivelRisco
                      ? {
                          id: filters.nivelRisco.id,
                          descricao: filters.nivelRisco.severidade,
                        }
                      : null
                  }
                  onChange={(e) =>
                    setFilter(
                      "nivelRisco",
                      niveisDeRisco.find((n) => n.id === e?.id) || null
                    )
                  }
                />
              </th>
              <th className={style.colOcorrencia}>
                <TableColumnFilter
                  items={condicoesInseguras.map((n) => ({
                    id: n.id,
                    descricao: n.nome,
                  }))}
                  placeholder="Ocorrência"
                  value={
                    filters.condicaoInsegura
                      ? {
                          id: filters.condicaoInsegura.id,
                          descricao: filters.condicaoInsegura.nome,
                        }
                      : null
                  }
                  onChange={(e) =>
                    setFilter(
                      "condicaoInsegura",
                      condicoesInseguras.find((c) => c.id === e?.id) || null
                    )
                  }
                />
              </th>
              <th className={style.colAutor}>Autor</th>
              <th className={style.colStatus}>
                <TableColumnFilter
                  items={status.map((n) => ({
                    id: n,
                    descricao: n,
                  }))}
                  placeholder="Status"
                  value={
                    filters.status
                      ? {
                          id: filters.status,
                          descricao: filters.status,
                        }
                      : null
                  }
                  onChange={(e) =>
                    setFilter("status", status.find((c) => c === e?.id) || null)
                  }
                />
              </th>
              <th className={style.colPlano}>Plano de Ação</th>
              <th className={style.colPrazo}>Prazo</th>
              <th className={style.colData}>Data de Criação</th>
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
