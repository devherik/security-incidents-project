"use client";

import { useCallback, useState } from "react";

import style from "./style.module.css";
import okIcon from "../../assets/icons/check.svg";
import undoneIcon from "../../assets/icons/undone.svg";

export default function StatusToggleButtons({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: boolean;
  onStatusChange: (value: boolean) => void;
}) {
  const [activeStatus, setActiveStatus] = useState(currentStatus);

  const handleStatusClick = useCallback(
    (status: boolean) => {
      setActiveStatus((prevStatus) => {
        if (prevStatus === status) return prevStatus;
        return status;
      });
      onStatusChange(status);
    },
    [onStatusChange]
  );

  return (
    <div className="flex flex-row gap-2">
      <button
        key={"status"}
        className={`${style.statusButton} ${
          activeStatus === false ? style.active : ""
        }`}
        onClick={() => handleStatusClick(false)}
        title="Concluída"
      >
        <span className="sr-only">Concluída</span>
        <img
          src={activeStatus ? undoneIcon : okIcon}
          alt="Concluído Icon"
          style={{ width: "20px", height: "20px" }}
        />
      </button>
    </div>
  );
}
