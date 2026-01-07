"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import styles from "./style.module.css";
import { useAuthStore } from "../../stores/useAuthStore";
import GhostButton from "../buttons/GhostButton";
import { useNavigate } from "react-router-dom";

const TextInfo = ({ label }: { label: string }) => (
  <span
    style={{
      color: "var(--primary-color)",
      fontSize: "0.8rem",
      fontFamily: "var(--secondary-font)",
    }}
  >
    {label}
  </span>
);

/** * OffCanvas component that displays a side panel.
 * @returns {JSX.Element|null} - Returns the off-canvas JSX or null if not visible.
 */

export default function OffCanvas({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const colaborador = useAuthStore((state) => state.colaborador);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const offCanvasRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeOffCanvas = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration

    return () => clearTimeout(timer);
  }, [onClose]);

  const toggleOffCanvas = useCallback(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      closeOffCanvas();
    }
  }, [isOpen, closeOffCanvas]);

  const handlelogout = () => {
    logout();
    closeOffCanvas();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    toggleOffCanvas();
  }, [isOpen, toggleOffCanvas]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        offCanvasRef.current &&
        !offCanvasRef.current.contains(event.target as Node)
      ) {
        closeOffCanvas();
      }
    };
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, offCanvasRef, closeOffCanvas]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.offCanvasOverlay} ${isOpen ? styles.open : ""}`}>
      <div
        className={`${styles.offCanvasPainel} ${isOpen && styles.open} ${
          isClosing ? styles.closed : ""
        }`}
        ref={offCanvasRef}
      >
        <header className={styles.offCanvasHeader}>
          <span
            style={{
              color: "var(--primary-color)",
              fontWeight: "bold",
              fontSize: "1.2rem",
              fontFamily: "var(--secondary-font)",
            }}
          >
            {colaborador?.first_name} {colaborador?.last_name}
          </span>
          <GhostButton label="Logout" onClick={handlelogout} />
        </header>
        <main className={styles.offCanvasContent}>
          <TextInfo label={colaborador ? `Id: ${colaborador.id}` : "Id: N/A"} />
          <TextInfo
            label={colaborador ? `E-mail: ${colaborador.email}` : "E-mail: N/A"}
          />
          <TextInfo
            label={
              colaborador
                ? `Desde: ${colaborador.date_joined?.split("T")[0]}`
                : "Id: N/A"
            }
          />
        </main>
      </div>
    </div>
  );
}
