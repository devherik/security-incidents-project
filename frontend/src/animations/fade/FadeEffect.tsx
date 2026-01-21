"use client";

import { useEffect, useState, useRef } from "react";
import style from "./style.module.css";

interface FadeEffectProps {
  children: React.ReactNode;
  duration?: number;
  direction?: "in" | "out";
  /**
   * Optional dependency that triggers the fade-out -> update -> fade-in sequence.
   * When this value changes, the component will animate out, update children, and animate in.
   */
  trigger?: unknown;
}

const FadeEffect = ({
  children,
  duration = 1,
  direction = "in",
  trigger,
}: FadeEffectProps) => {
  // Validate props
  let validDuration = duration;
  if (validDuration > 2 || validDuration <= 0) {
    validDuration = 1;
  }

  let validDirection = direction;
  if (validDirection !== "in" && validDirection !== "out") {
    validDirection = "in";
  }

  // State to manage the animation phase and the content being displayed
  const [mode, setMode] = useState<"in" | "out">(validDirection);
  const [renderedChildren, setRenderedChildren] = useState(children);
  const isFirstRender = useRef(true);

  // Effect to handle the transition sequence when 'trigger' changes
  useEffect(() => {
    // If no trigger is provided, we behave like a standard component
    // and just sync the children and direction immediately.
    if (trigger === undefined) {
      setRenderedChildren(children);
      setMode(validDirection);
      return;
    }

    // On the very first render, we just show the content without the out-in sequence
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setRenderedChildren(children);
      setMode("in");
      return;
    }

    // TRIGGER CHANGED: Start the sequence
    // 1. Fade Out
    setMode("out");

    // 2. Wait for the fade-out animation to finish
    const timeout = setTimeout(() => {
      // 3. Update the content to the new children and Fade In
      setRenderedChildren(children);
      setMode("in");
    }, validDuration * 1000);

    return () => clearTimeout(timeout);
  }, [trigger, children, validDuration, validDirection]);

  // Determine the specific CSS class based on mode and duration
  let fadeClass = null;
  if (mode === "out") {
    switch (validDuration) {
      case 2:
        fadeClass = style.fade_out_2s;
        break;
      case 1:
        fadeClass = style.fade_out_1s;
        break;
      case 0.5:
        fadeClass = style.fade_out_05s;
        break;
      default:
        break;
    }
  } else {
    switch (validDuration) {
      case 2:
        fadeClass = style.fade_in_2s;
        break;
      case 1:
        fadeClass = style.fade_in_1s;
        break;
      case 0.5:
        fadeClass = style.fade_in_05s;
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={`${style.fade} ${style[mode]} ${fadeClass}`}
      style={{ animationDuration: `${validDuration}s` }}
    >
      {renderedChildren}
    </div>
  );
};

export default FadeEffect;