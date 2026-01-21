import type { JSX } from "react";
import styles from "./style.module.css";

import imgSuccess from "../../assets/icons/success.svg";
import imgError from "../../assets/icons/error.svg";
import imgInfo from "../../assets/icons/info.svg";
import { useAppStore } from "../../stores/useAppStore";

interface ToastIcon {
  type: "success" | "error" | "info" | "warning";
  icon: JSX.Element;
}

const icons: Record<ToastIcon["type"], ToastIcon["icon"]> = {
  success: <img src={imgSuccess} alt="Success" />,
  error: <img src={imgError} alt="Error" />,
  info: <img src={imgInfo} alt="Info" />,
  warning: <img src={imgInfo} alt="Warning" />,
};

export default function Toast() {
  const { toast } = useAppStore();
  const { message, type, visible } = toast;

  if (!visible) return null;

  return (
    <div className={`toast ${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>{icons[type]}</div>
      <p>{message}</p>
    </div>
  );
}
