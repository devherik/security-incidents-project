import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ImageMetadata } from "../schemas/stateSchemas";

/**
 * =============================================================================
 * APPLICATION STATE STORE
 * =============================================================================
 *
 * This Zustand store manages global application state for UI concerns
 * following Clean Architecture and SOLID principles.
 *
 * RESPONSIBILITIES (Single Responsibility Principle):
 * - Global loading state management (spinners, overlays)
 * - Toast notification system (success, error, info messages)
 * - Transient UI state that affects multiple components
 *
 * ARCHITECTURE NOTES:
 * - This is a PRESENTATION LAYER concern, not business logic
 * - Toast notifications are UI feedback, not domain events
 * - Should NOT contain business data (use domain-specific stores for that)
 * - Should NOT persist toast state (it's transient by nature)
 *
 * DESIGN CONSIDERATION:
 * Currently using setTimeout for toast auto-dismissal. For production apps,
 * consider using a more robust solution that handles:
 * - Component unmounting (cleanup)
 * - Multiple simultaneous toasts (queue)
 * - User-dismissible toasts
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Toast notification types
 * Following common UX patterns for user feedback
 */
type ToastType = "success" | "error" | "info" | "warning";

/**
 * Toast state structure
 * Represents a single toast notification
 */
interface ToastState {
  /** The message to display to the user */
  message: string;
  /** The type/severity of the notification */
  type: ToastType;
  /** Whether the toast is currently visible */
  visible: boolean;
}

/**
 * The complete state shape for the application store
 * Keep this focused on UI concerns only
 */
interface AppState {
  // =============================================================================
  // STATE - Global UI State
  // =============================================================================

  /**
   * Global loading indicator state
   * Use this for app-wide loading states (e.g., initial data fetch)
   * For component-specific loading, use local state instead
   */
  isLoading: boolean;

  /**
   * Current toast notification state
   * LIMITATION: Only supports one toast at a time
   * For multiple toasts, consider implementing a queue system
   */
  toast: ToastState;

  /** Whether the navbar is visible */
  visibleNavbar: boolean;

  /** Set the visibility of the navbar */
  setVisibleNavbar: (visible: boolean) => void;

  // =============================================================================
  // ACTIONS - State Mutations
  // =============================================================================

  /**
   * Set the global loading state
   *
   * @param loading - True to show loading indicator, false to hide
   *
   * USE CASE:
   * - App initialization
   * - Global data fetching that blocks UI
   * - Authentication/authorization checks
   *
   * AVOID:
   * - Component-specific loading (use local state)
   * - Multiple simultaneous loading operations (use operation-specific flags)
   */
  setLoading: (loading: boolean) => void;

  /**
   * Display a toast notification
   *
   * @param message - The message to display to the user
   * @param type - The type of notification (default: "info")
   * @param duration - How long to display the toast in ms (default: 3000)
   *
   * BEHAVIOR:
   * - Automatically dismisses after `duration` milliseconds
   * - Replaces any existing toast (no queue)
   * - Does NOT persist across page reloads
   *
   * EXAMPLES:
   * ```tsx
   * showToast("Tarefa criada com sucesso!", "success");
   * showToast("Erro ao salvar dados", "error");
   * showToast("Processando...", "info", 5000);
   * ```
   *
   * LIMITATION:
   * If called multiple times rapidly, only the last toast will be visible.
   * Consider implementing a queue for production use.
   */
  showToast: (message: string, type?: ToastType, duration?: number) => void;

  /**
   * Hide the current toast immediately
   * Useful for user-triggered dismissal or cleanup
   */
  hideToast: () => void;

  /** Fetch an image from the server by filename
   *
   * @param filename - The name of the image file to fetch
   */
  fetchAnImage(filename: string): Promise<Blob | null>;

  /** Upload an image to the server
   *
   * @param image - The image file to upload
   */
  uploadAnImage(image: File): Promise<ImageMetadata | null>;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  isLoading: false,
  toast: {
    message: "",
    type: "info" as ToastType,
    visible: false,
  },
  visibleNavbar: true,
  setVisibleNavbar: (visible: boolean) => {
    initialState.visibleNavbar = visible;
  },
};

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

/**
 * The main Zustand store for global application state
 *
 * PERSISTENCE STRATEGY:
 * - Does NOT persist toast state (transient UI feedback)
 * - Does NOT persist loading state (transient operation status)
 * - This store is intentionally NOT persisted for better UX
 *
 * WHY NO PERSISTENCE?
 * Toast notifications are contextual and time-sensitive. Showing a
 * "success" message from a previous session would be confusing.
 * Loading states should reset on page load for accurate feedback.
 *
 * USAGE EXAMPLE:
 * ```tsx
 * const { isLoading, setLoading, showToast } = useAppStore();
 *
 * const handleSave = async () => {
 *   setLoading(true);
 *   try {
 *     await saveData();
 *     showToast("Dados salvos com sucesso!", "success");
 *   } catch (error) {
 *     showToast("Erro ao salvar dados", "error");
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * ```
 *
 * ARCHITECTURAL NOTE:
 * The persist middleware is currently applied but does nothing because
 * we don't specify what to persist. Consider removing it entirely for clarity,
 * or explicitly set `partialize: () => ({})` to document the intent.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initialize state
      ...initialState,

      // =============================================================================
      // LOADING STATE MANAGEMENT
      // =============================================================================

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // =============================================================================
      // TOAST NOTIFICATION MANAGEMENT
      // =============================================================================

      showToast: (
        message: string,
        type: ToastType = "info",
        duration: number = 3000
      ) => {
        // Show the toast
        set({
          toast: {
            message,
            type,
            visible: true,
          },
        });

        // Auto-dismiss after duration
        // NOTE: In production, store the timeout ID and clear it if component unmounts
        // or if showToast is called again before the timeout completes
        setTimeout(() => {
          // Only hide if the message hasn't changed (prevents hiding a new toast)
          const currentToast = get().toast;
          if (currentToast.message === message) {
            set({
              toast: {
                message: "",
                type: "info",
                visible: false,
              },
            });
          }
        }, duration);
      },

      hideToast: () => {
        set({
          toast: {
            message: "",
            type: "info",
            visible: false,
          },
        });
      },

      setVisibleNavbar: (visible: boolean) => {
        set({ visibleNavbar: visible });
      },

      // =============================================================================
      // IMAGE HANDLING METHODS
      // =============================================================================
      async fetchAnImage(url: string): Promise<Blob | null> {
        try {
          // return GeneralServer.fetchAnImage(url);
          console.log("fetchAnImage called with url:", url);
          return null;
        } catch (error) {
          console.error("Error in fetchAnImage:", error);
          throw error;
        }
      },

      async uploadAnImage(image: File): Promise<ImageMetadata | null> {
        try {
          // return GeneralServer.uploadAnImage(image);
          console.log("uploadAnImage called with image:", image);
          return null;
        } catch (error) {
          console.error("Error in uploadAnImage:", error);
          throw error;
        }
      },
    }),
    {
      name: "app-storage",
      // Explicitly don't persist anything - this store is for transient UI state
      partialize: () => ({}),
    }
  )
);
