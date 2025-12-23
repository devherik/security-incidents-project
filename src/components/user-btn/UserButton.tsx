"use client";

import userOn from "../../assets/icons/user-on.svg";
import style from "./style.module.css";
import OffCanvas from "../off-canvas/offCanvas";
import { useCallback, useState } from "react";

export default function UserButton() {
  const [offCanvasState, setOffCanvasState] = useState(false);

  const handleOffCanvasClose = useCallback(() => {
    setOffCanvasState(false);
  }, []);

  const handleOffCanvasOpen = useCallback(() => {
    setOffCanvasState(true);
  }, []);

  return (
    <>
      <button
        onClick={() => handleOffCanvasOpen()}
        className={style.btn}
      >
        <img className={style.icon} src={userOn} alt="User On" />
      </button>
      <OffCanvas isOpen={offCanvasState} onClose={handleOffCanvasClose} />
    </>
  );
}
