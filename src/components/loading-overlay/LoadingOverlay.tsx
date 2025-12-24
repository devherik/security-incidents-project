import React from "react";

import "./style.module.css";

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
    <div className={`relative isolation-auto ${className}`}>
      {/* 2. The Content: We render children regardless of loading state 
          to preserve dimensions. This prevents layout shift. 
          We prevent interaction when loading. */}
      <div
        className={
          isLoading
            ? "pointer-events-none select-none opacity-50 transition-opacity duration-300"
            : ""
        }
      >
        {children}
      </div>

      {/* 3. The Overlay: Only mounts when loading. 
          aria-live asserts updates to screen readers. */}
      {isLoading && (
        <div
          role="status"
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-md bg-white/30 backdrop-blur-[1px]"
        >
          {/* The Wave/Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent" />
        </div>
      )}
    </div>
  );
}
