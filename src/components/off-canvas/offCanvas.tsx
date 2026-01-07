import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/useAuthStore";
import { useNotificacaoStore } from "../../stores/useNotificacaoStore";

import styles from "./style.module.css";

import GhostButton from "../buttons/GhostButton";

import arrowRighticon from "../../assets/icons/arrow-right.svg";

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

  const notificacoes = useNotificacaoStore((state) => state.notificacoes);
  const marcarComoLida = useNotificacaoStore((state) => state.marcarComoLida);
  const marcarTodasComoLidas = useNotificacaoStore(
    (state) => state.marcarTodasComoLidas
  );

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

  const handleTapNotificacao = (notificacaoId: number) => {
    marcarComoLida(notificacaoId);
  };

  const handleMarcarTodasComoLidas = () => {
    if (!colaborador) return;
    marcarTodasComoLidas(colaborador.id);
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
          <div className={styles.offCanvasHeaderTop}>
            <span>
              {colaborador?.first_name} {colaborador?.last_name}
            </span>
            <GhostButton label="Sair" onClick={handlelogout} />
          </div>
          <div className={styles.offCanvasHeaderBottom}>
            <TextInfo
              label={colaborador ? `Id: ${colaborador.id}` : "Id: N/A"}
            />
            <TextInfo
              label={
                colaborador ? `E-mail: ${colaborador.email}` : "E-mail: N/A"
              }
            />
            <TextInfo
              label={
                colaborador
                  ? `Desde: ${colaborador.date_joined?.split("T")[0]}`
                  : "Id: N/A"
              }
            />
          </div>
        </header>
        <main className={styles.offCanvasContent}>
          <div className={styles.notificacoesContent}>
            <span className={styles.notificacoesTitle}>Notificações</span>
            {notificacoes.length > 0 ? (
              notificacoes.map((notificacao) => (
                <div
                  onClick={() => handleTapNotificacao(notificacao.id)}
                  className={`${styles.notificacao} ${
                    styles[notificacao.tipo_alerta]
                  }`}
                  key={notificacao.id}
                >
                  <div className="flex flex-col">
                    {notificacao.tipo_alerta === "Novo" ? (
                      <span>Novo RCI registrado!</span>
                    ) : (
                      <span>Alteração no RCI!</span>
                    )}
                    <p>{notificacao.dtcriacao.split("T")[0]}</p>
                  </div>
                  <img src={arrowRighticon} alt="Arrow Right" />
                </div>
              ))
            ) : (
              <TextInfo label="Nenhuma notificação disponível." />
            )}
            <GhostButton
              label="Marcar todas como lidas"
              onClick={handleMarcarTodasComoLidas}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
