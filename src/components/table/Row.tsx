import { useNavigate } from "react-router-dom";

import type { Rci } from "../../schemas/rciSchemas";
import type { RciStatus } from "../../schemas/enums";
import type { NivelRisco } from "../../schemas/stateSchemas";

import { formatDateToISO } from "../../utils/dateUtil";

import linkIcon from "../../assets/icons/link.svg";

import style from "./style.module.css";

// Status color mapping matching SelectStatusForm
const statusColorMap: Record<string, string> = {
  Aberto: style.statusAberto,
  "Em Análise": style.statusEmAnalise,
  "Em Andamento": style.statusEmAndamento,
  Finalizado: style.statusFinalizado,
  Rejeitado: style.statusRejeitado,
};

const riscoColorMap: Record<string, string> = {
  G1: style.riscoG1,
  G2: style.riscoG2,
  G3: style.riscoG3,
  G4: style.riscoG4,
  G5: style.riscoG5,
};

interface StatusBadgeProps {
  status: RciStatus | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colorClass = statusColorMap[status] || "";

  return (
    <span className={`${style.badge} ${colorClass}`}>
      <span className={style.dot}></span>
      {status}
    </span>
  );
};

const NivelRiscoBadge = ({ risco }: { risco: NivelRisco }) => {
  const colorClass = riscoColorMap[risco.sigla_risco] || "";

  return (
    <span className={`${style.badge} ${colorClass}`}>
      {`${risco.sigla_risco} - ${risco.severidade}`}
    </span>
  );
};

const LinkBadge = ({ link }: { link?: string }) => {
  if (!link) {
    return (
      <span className={style.noLinkBadge}>
        <img
          className={style.linkIconDisabled}
          src={linkIcon}
          alt="No link available"
        />
      </span>
    );
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={style.linkBadge}
    >
      <img
        className={style.linkIcon}
        src={linkIcon}
        alt="Link to action plan"
      />
    </a>
  );
};

export default function Row({ rci }: { rci: Rci }) {
  const navigate = useNavigate();

  const handleRciClick = () => {
    navigate(`/rci/${rci.id}`, { replace: false, state: { rci } });
  };

  return (
    <tr className={style.row} key={rci.id} onClick={handleRciClick}>
      <th>{rci.unidade.sigla}</th>
      <th>
        <NivelRiscoBadge risco={rci.nivel_risco} />
      </th>
      <th>{rci.condicao_insegura.nome}</th>
      <th>{rci.autor.first_name}</th>
      <th>
        <StatusBadge status={rci.status} />
      </th>
      <th>
        <LinkBadge link={rci.link_plano_acao} />
      </th>
      <th>{formatDateToISO(new Date(rci.dtcriacao))}</th>
    </tr>
  );
}
