import style from "./style.module.css";

export default function FrequencyBadge({ frequencia }: { frequencia: string }) {
  let badgeStyle = "";
  switch (frequencia) {
    case "diaria":
      badgeStyle = style.badgeDiaria;
      break;
    case "semanal":
      badgeStyle = style.badgeSemanal;
      break;
    case "mensal":
      badgeStyle = style.badgeMensal;
      break;
    case "trimestral":
      badgeStyle = style.badgeTrimestral;
      break;
    case "semestral":
      badgeStyle = style.badgeSemestral;
      break;
    case "anual":
      badgeStyle = style.badgeAnual;
      break;
    default:
      badgeStyle = style.badgeDefault;
  }

  return (
    <span className={`${style.badgeBase} ${badgeStyle}`}>{frequencia}</span>
  );
}
