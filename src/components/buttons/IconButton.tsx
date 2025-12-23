"use client";

import style from "./style.module.css";
import saveIcon from "../../assets/icons/done-selected.svg";
import deleteIcon from "../../assets/icons/delete.svg";

export default function IconButton({
  onClick,
  disabled,
  isDelete = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  isDelete?: boolean;
}) {
  return (
    <button
      className={isDelete ? style.deleteIconButton : style.iconButton}
      onClick={onClick}
      disabled={disabled}
      aria-label={isDelete ? "Delete" : "Save"}
    >
      <img
      className={style.icon}
        src={isDelete ? deleteIcon : saveIcon}
        alt={isDelete ? "Delete" : "Save"}
      />
    </button>
  );
}
