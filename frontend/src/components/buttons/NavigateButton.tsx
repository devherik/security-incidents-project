"use client";

import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

import arrowLeft from "../../assets/icons/arrow-left.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";

export default function NavigateButton({
  path,
  alt,
  direction,
}: {
  path: string;
  alt: string;
  direction: "left" | "right";
}) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(path);
  }, [navigate, path]);

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
      title={alt}
    >
      <img
        src={direction === "left" ? arrowLeft : arrowRight}
        alt={alt}
        className="h-8"
        style={{
          width: "1.25rem",
          objectFit: "contain",
          color: "var(--green-color)",
        }}
      />
      <span
        style={{
          fontFamily: "var(--secondary-font)",
          fontSize: "1rem",
          color: "var(--text-color)",
        }}
      >
        Voltar
      </span>
    </button>
  );
}
