"use client";

import React, { useCallback, useState } from "react";

import style from "./style.module.css";
import addCircle from "../../assets/icons/add-circle.svg";
import Modal from "../../components/modal/Modal";
import { useNavigate } from "react-router-dom";

export default function NewItemButton({
  label,
  alt,
  children,
  navigateTo,
}: {
  label: string;
  alt: string;
  children?: React.ReactNode;
  navigateTo?: string;
}) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (navigateTo) {
    return (
      <button
        className={style.button}
        onClick={() => navigate(navigateTo)}
        type="button"
      >
        <img className={style.icon} src={addCircle} alt={alt} />
        {label}
      </button>
    );
  } else {
    return (
      <>
        <button
          className={style.button}
          onClick={handleOpenModal}
          type="button"
        >
          <img className={style.icon} src={addCircle} alt={alt} />
          {label}
        </button>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} isBlur={true}>
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<{ onClose?: () => void }>, {
                onClose: handleCloseModal,
              })
            : children}
        </Modal>
      </>
    );
  }
}
