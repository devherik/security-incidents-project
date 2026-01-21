import style from "./style.module.css";

export default function BaseButton({
  label,
  onClick,
  disabled,
  isDelete = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isDelete?: boolean;
}) {
  return (
    <button className={isDelete ? style.deleteButton : style.button} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
