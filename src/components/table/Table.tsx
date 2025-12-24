import { useEffect, useState } from "react";

import { useRcisStore } from "../../stores/useRcisStore";
import { useAuthStore } from "../../stores/useAuthStore";

import { formatDateToISO } from "../../utils/dateUtil";

import style from "./style.module.css";

import LoadingOverlay from "../loading-overlay/LoadingOverlay";

export default function Table() {
  const colaborador = useAuthStore((state) => state.colaborador);
  const rcis = useRcisStore((state) => state.filteredRcis);

  const [isLoading, setIsLoading] = useState(false);

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
    <div>
      {/* Table filters, search, export and pagination */}
      <div></div>
      {/* Table content */}
      <LoadingOverlay isLoading={isLoading}>
        <table>
          <thead>
            <tr>
              <th>Unidade</th>
              <th>Grau de Risco</th>
              <th>Ocorrência</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Plano de Ação</th>
              <th>Período</th>
            </tr>
          </thead>
          <tbody>
            {rcis.map((rci) => (
              <tr key={rci.id}>
                <th>{rci.unidade.sigla}</th>
                <th>{`${rci.nivel_risco.sigla_risco} - ${rci.nivel_risco.severidade}`}</th>
                <th>{rci.condicao_insegura.nome}</th>
                <th>{rci.autor.first_name}</th>
                <th>{rci.status}</th>
                <th>{rci.link_plano_acao}</th>
                <th>{formatDateToISO(new Date(rci.dtcriacao))}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </LoadingOverlay>
    </div>
  );
}
