"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import styles from "./style.module.css";
import { useAuthStore } from "../../stores/useAuthStore";
import ImageContainer from "../image-container/ImageContainer";
import { useCargosStore } from "../../stores/useCargosStore";

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
  const offCanvasRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const colaborador = useAuthStore((state) => state.colaborador);
  const getCargoNameById = useCargosStore((state) => state.getCargoNameById);

  const closeOffCanvas = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration

    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      closeOffCanvas();
    }
  }, [isOpen, isVisible, closeOffCanvas]);

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

  const UserProfile = () => (
    <div className={styles.userProfile}>
      <div className={styles.userAvatar}>
        <ImageContainer
          image={{
            url: colaborador?.foto_url || "",
            filename: colaborador?.nome_completo || "user-avatar",
            altText: colaborador?.nome_completo || "User Avatar",
          }}
          altText="User Avatar"
        />
      </div>
    </div>
  );

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

  return (
    <div className={`${styles.offCanvasOverlay} ${isOpen ? styles.open : ""}`}>
      <div
        className={`${styles.offCanvasPainel} ${isOpen && styles.open} ${
          isClosing ? styles.closed : ""
        }`}
        ref={offCanvasRef}
      >
        <header className={styles.offCanvasHeader}>
          <UserProfile />
          <span
            style={{
              color: "var(--primary-color)",
              fontWeight: "bold",
              fontSize: "1.2rem",
              fontFamily: "var(--secondary-font)",
            }}
          >
            {colaborador?.nome_completo}
          </span>
        </header>
        <main className={styles.offCanvasContent}>
          <TextInfo
            label={colaborador ? `Email: ${colaborador.email}` : "Email: N/A"}
          />
          <TextInfo
            label={
              colaborador
                ? `Cargo: ${getCargoNameById(colaborador.cargo)}`
                : "Cargo: N/A"
            }
          />
        </main>
      </div>
    </div>
  );
}
