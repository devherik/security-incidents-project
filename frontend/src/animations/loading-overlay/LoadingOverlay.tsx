import React from "react";

import style from "./style.module.css";

// Strict typing for our props
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  /**
   * Optional className for the outer wrapper, useful for positioning
   * relative to other page elements.
   */
  className?: string;
}

export default function LoadingOverlay({
  isLoading,
  children,
  className,
}: LoadingOverlayProps) {
  return (
    // 1. The Container: Must be 'relative' to trap the absolute overlay.
    // We utilize 'iso' isolation to create a new stacking context.
    <div className={`${style.container} ${className || ""}`}>
      {/* 2. The Content: We render children regardless of loading state 
          to preserve dimensions. This prevents layout shift. 
          We prevent interaction when loading. */}
      <div
        className={`${style.content} ${isLoading ? style.contentLoading : ""}`}
      >
        {children}
      </div>

      {/* 3. The Overlay: Only mounts when loading. 
          aria-live asserts updates to screen readers. */}
      {isLoading && (
        <div role="status" aria-busy="true" className={style.overlay}>
          {/* The Wave/Shimmer Effect */}
          <div className={style.shimmer} />
        </div>
      )}
    </div>
  );
}

