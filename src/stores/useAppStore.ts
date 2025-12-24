import { create } from "zustand";
import { persist } from "zustand/middleware";

import AppServer from "../servers/AppServer";

import type {
  CondicaoInsegura,
  ImageMetadata,
  NivelRisco,
  Setor,
  Unidade,
} from "../schemas/stateSchemas";

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

  // Cached data
  condicoesInseguras: CondicaoInsegura[];
  niveisDeRisco: NivelRisco[];
  unidades: Unidade[];
  setores: Setor[];
  status: ["Aberto", "Em Análise", "Em Andamento", "Finalizado", "Rejeitado"];
  periodo: [
    "Últimas 24 horas",
    "Últimos 7 dias",
    "Últimos 30 dias",
    "Últimos 90 dias",
    "Todos"
  ];

  // Data fetching actions
  getCondicoesInseguras: () => Promise<void>;
  getNiveisDeRisco: () => Promise<void>;
  getUnidades: () => Promise<void>;
  getSetores: () => Promise<void>;
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
  status: [
    "Aberto",
    "Em Análise",
    "Em Andamento",
    "Finalizado",
    "Rejeitado",
  ] as ["Aberto", "Em Análise", "Em Andamento", "Finalizado", "Rejeitado"],
  periodo: [
    "Últimas 24 horas",
    "Últimos 7 dias",
    "Últimos 30 dias",
    "Últimos 90 dias",
    "Todos",
  ] as [
    "Últimas 24 horas",
    "Últimos 7 dias",
    "Últimos 30 dias",
    "Últimos 90 dias",
    "Todos"
  ],
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
          set({ condicoesInseguras: data });
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
          set({ unidades: data });
        } catch (error) {
          console.error("Error fetching units:", error);
        }
      },

      getSetores: async () => {
        try {
          const data = await AppServer.fetchSetores("");
          set({ setores: data });
        } catch (error) {
          console.error("Error fetching sectors:", error);
        }
      },

      getSetoresByUnidade: async (unidadeId: string) => {
        try {
          const data = await AppServer.fetchSetores(unidadeId);
          set({ setores: data });
        } catch (error) {
          console.error("Error fetching sectors by unit:", error);
        }
      },

      fecthInitData: async () => {
        try {
          await Promise.all([
            get().getCondicoesInseguras(),
            get().getNiveisDeRisco(),
            get().getUnidades(),
          ]);
        } catch (error) {
          console.error("Error fetching initial data:", error);
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
