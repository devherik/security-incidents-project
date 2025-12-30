import { useNavigate } from "react-router-dom";

import type { Rci } from "../../schemas/rciSchemas";
import type { RciStatus } from "../../schemas/enums";

import { formatDateToISO } from "../../utils/dateUtil";

import style from "./style.module.css";

// Status color mapping matching SelectStatusForm
const statusColorMap: Record<string, string> = {
  Aberto: style.statusAberto,
  "Em Análise": style.statusEmAnalise,
  "Em Andamento": style.statusEmAndamento,
  Finalizado: style.statusFinalizado,
  Rejeitado: style.statusRejeitado,
};

interface StatusBadgeProps {
  status: RciStatus | string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColorMap[status] || "";

  return (
    <span className={`${style.badge} ${colorClass}`}>
      <span className={style.dot}></span>
      {status}
    </span>
  );
}

export default function Row({ rci }: { rci: Rci }) {
  const navigate = useNavigate();

  const handleRciClick = () => {
    navigate(`/rci/${rci.id}`, { replace: false, state: { rci } });
  };

  return (
    <tr className={style.row} key={rci.id} onClick={handleRciClick}>
      <th>{rci.unidade.sigla}</th>
      <th>{`${rci.nivel_risco.sigla_risco} - ${rci.nivel_risco.severidade}`}</th>
      <th>{rci.condicao_insegura.nome}</th>
      <th>{rci.autor.first_name}</th>
      <th>
        <StatusBadge status={rci.status} />
      </th>
      <th>{rci.link_plano_acao}</th>
      <th>{formatDateToISO(new Date(rci.dtcriacao))}</th>
    </tr>
  );
}
