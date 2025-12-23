import style from "./style.module.css";

export default function GhostButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className={style.ghostButton} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}