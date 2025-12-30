import { create } from "zustand";
import { persist } from "zustand/middleware";

import AppServer from "../servers/AppServer";

import { orderByField } from "../utils/listsUtil";

import type {
  CondicaoInsegura,
  ImageMetadata,
  NivelRisco,
  Setor,
  Unidade,
  UnidadeSetor,
  DateRange,
} from "../schemas/stateSchemas";
import type { RciStatus } from "../schemas/enums";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

/**
 * The complete state shape for the application store
 * Keep this focused on UI concerns only
 */
interface AppState {
  // General UI state
  isLoading: boolean;
  toast: ToastState;
  visibleNavbar: boolean;
  isInitialized: boolean; // Track if initial data has been loaded

  // Cached data
  condicoesInseguras: CondicaoInsegura[];
  niveisDeRisco: NivelRisco[];
  unidades: Unidade[];
  setores: Setor[];
  setoresUnidade: UnidadeSetor[];
  status: RciStatus[];
  periodo: DateRange;

  // Data fetching actions
  getCondicoesInseguras: () => Promise<void>;
  getNiveisDeRisco: () => Promise<void>;
  getUnidades: () => Promise<void>;
  getSetoresByUnidade: (unidadeId: string) => Promise<void>;
  fecthInitData: () => Promise<void>;

  // Actions
  setVisibleNavbar: (visible: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
  fetchAnImage(filename: string): Promise<Blob | null>;
  uploadAnImage(image: File): Promise<ImageMetadata | null>;
}

const initialState = {
  condicoesInseguras: [],
  niveisDeRisco: [],
  unidades: [],
  setores: [],
  setoresUnidade: [],
  status: [
    "Aberto",
    "Em Análise",
    "Em Andamento",
    "Finalizado",
    "Rejeitado",
  ] as RciStatus[],
  periodo: {
    startDate: null,
    endDate: null,
  },
  isLoading: false,
  isInitialized: false,
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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initialize state
      ...initialState,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

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

      // Data fetching actions
      getCondicoesInseguras: async () => {
        try {
          const data = await AppServer.fetchCondicoesInseguras();
          const orderedData = orderByField<CondicaoInsegura>({
            list: data,
            field: "nome",
            descending: false,
          });
          set({ condicoesInseguras: orderedData });
        } catch (error) {
          console.error("Error fetching unsafe conditions:", error);
        }
      },

      getNiveisDeRisco: async () => {
        try {
          const data = await AppServer.fetchNiveisDeRisco();
          set({ niveisDeRisco: data });
        } catch (error) {
          console.error("Error fetching risk levels:", error);
        }
      },

      getUnidades: async () => {
        try {
          const data = await AppServer.fetchUnidades();
          const orderedData = orderByField<Unidade>({
            list: data,
            field: "nome",
            descending: false,
          });
          set({ unidades: orderedData });
        } catch (error) {
          console.error("Error fetching units:", error);
        }
      },

      getSetoresByUnidade: async (unidadeId: string) => {
        try {
          const data = await AppServer.fetchSetores(unidadeId);
          const orderedData = orderByField<UnidadeSetor>({
            list: data,
            field: "setor",
            descending: false,
          });
          set({ setoresUnidade: orderedData });
        } catch (error) {
          console.error("Error fetching sectors by unit:", error);
        }
      },

      fecthInitData: async () => {
        // Skip if already initialized - this prevents redundant fetches
        // when the component remounts after navigation
        if (get().isInitialized) {
          console.log("App already initialized, skipping data fetch");
          return;
        }

        try {
          await Promise.all([
            get().getCondicoesInseguras(),
            get().getNiveisDeRisco(),
            get().getUnidades(),
          ]);

          // Mark as initialized after successful fetch
          set({ isInitialized: true });
        } catch (error) {
          console.error("Error fetching initial data:", error);
          // Don't set isInitialized on error, allowing retry on next mount
        }
      },

      async fetchAnImage(url: string): Promise<Blob | null> {
        try {
          return AppServer.fetchImage(url);
        } catch (error) {
          console.error("Error in fetchAnImage:", error);
          throw error;
        }
      },

      async uploadAnImage(image: File): Promise<ImageMetadata | null> {
        try {
          const response = await AppServer.uploadImage(image);
          return response.imageUrl;
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
