import { useNavigate } from "react-router-dom";
import type { Rci } from "../../schemas/rciSchemas";

import { formatDateToISO } from "../../utils/dateUtil";

import style from "./style.module.css";

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
      <th>{rci.status}</th>
      <th>{rci.link_plano_acao}</th>
      <th>{formatDateToISO(new Date(rci.dtcriacao))}</th>
    </tr>
  );
}
