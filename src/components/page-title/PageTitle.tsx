"use client";

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import arrowLeft from "../../assets/icons/arrow-left.svg";
import { useAppStore } from "../../stores/useAppStateStore";

export default function PageTitle({
  title,
  subtitle,
  showBackButton,
}: {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}) {
  const setVisibleNavbar = useAppStore((state) => state.setVisibleNavbar);
  const navigate = useNavigate();

  useEffect(() => {
    if (showBackButton) {
      setVisibleNavbar(false);
    } else {
      setVisibleNavbar(true);
    }
  }, [setVisibleNavbar, showBackButton]);

  const handleClick = useCallback(() => {
    if (showBackButton) {
      setVisibleNavbar(true);
      navigate(-1);
    }
  }, [navigate, showBackButton, setVisibleNavbar]);

  const BackButton = () => {
    return (
      <button
        style={{
          border: "1px solid rgba(255, 255, 255, 0.1)",
          cursor: "pointer",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
        className="flex items-center space-x-4"
        onClick={handleClick}
        title="Voltar"
      >
        <img
          src={arrowLeft}
          alt="Voltar"
          className="h-8"
          style={{
            width: "1.25rem",
            objectFit: "contain",
            color: "var(--green-color)",
          }}
        />
      </button>
    );
  };

  return (
    <div className="flex flex-row items-center gap-6 mb-6">
      {showBackButton && <BackButton />}
      <div className="flex flex-col gap-1 w-fit">
        <span
          style={{
            fontFamily: "var(--main-font)",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--color-primary)",
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontFamily: "var(--secondary-font)",
              fontSize: "0.875rem",
              color: "var(--primary-color)",
              borderRadius: "8px",
              backgroundColor: "var(--accent-color)",
              border: "1px solid var(--accent-color)",
              padding: "0.25rem 1rem",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
