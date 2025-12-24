import { create } from "zustand";

import RcisServer from "../servers/RcisServer";

import { orderByDate } from "../utils/listsUtil";

import type { Rci, RciCreate, RciUpdate } from "../schemas/rciSchemas";
import type {
  CondicaoInsegura,
  NivelRisco,
  Unidade,
} from "../schemas/stateSchemas";
import type { RciStatus } from "../schemas/enums";

export interface RciFilters {
  periodo: string;
  ativo: boolean;
  condicaoInsegura: CondicaoInsegura | null;
  unidade: Unidade | null;
  nivelRisco: NivelRisco | null;
  status: RciStatus | null;
}

interface RciState {
  rcis: Rci[];
  filteredRcis: Rci[];
  filters: RciFilters;
  isLoading: boolean;
  error: string | null;

  fetchRcis: (userId: string) => Promise<void>;
  createRci: (rciData: RciCreate) => Promise<void>;
  updateRci: (rciId: string, rciData: RciUpdate) => Promise<void>;
  deleteRci: (rciId: string) => Promise<void>;

  setFilter: <K extends keyof RciFilters>(key: K, value: RciFilters[K]) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useRcisStore = create<RciState>((set, get) => ({
  rcis: [],
  filteredRcis: [],
  filters: {
    periodo: "Todos",
    ativo: false,
    condicaoInsegura: null,
    unidade: null,
    nivelRisco: null,
    status: null,
  },
  isLoading: false,
  error: null,

  fetchRcis: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await RcisServer.fetchUserRcis(userId);
      // Ensure dates are Date objects
      const rcisWithDates = data.map((rci) => ({
        ...rci,
        dtcriacao: new Date(rci.dtcriacao),
        dtmodificacao: new Date(rci.dtmodificacao),
        data_limite: new Date(rci.data_limite),
      }));

      const rcisOrdered = orderByDate({
        list: rcisWithDates,
        dateField: "dtcriacao",
        descending: true,
      });

      set({ rcis: rcisOrdered, filteredRcis: rcisOrdered });
      get().applyFilters();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch RCIs";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createRci: async (rciData: RciCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newRci = await RcisServer.createRci(rciData);
      const rciWithDates = {
        ...newRci,
        dtcriacao: new Date(newRci.dtcriacao),
        dtmodificacao: new Date(newRci.dtmodificacao),
        data_limite: new Date(newRci.data_limite),
      };
      set((state) => {
        const updatedRcis = [...state.rcis, rciWithDates];
        return { rcis: updatedRcis };
      });
      get().applyFilters();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create RCI";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRci: async (rciId: string, rciData: RciUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRci = await RcisServer.updateRci(rciId, rciData);
      const rciWithDates = {
        ...updatedRci,
        dtcriacao: new Date(updatedRci.dtcriacao),
        dtmodificacao: new Date(updatedRci.dtmodificacao),
        data_limite: new Date(updatedRci.data_limite),
      };
      set((state) => {
        const updatedRcis = state.rcis.map((r) =>
          r.id === rciWithDates.id ? rciWithDates : r
        );
        return { rcis: updatedRcis };
      });
      get().applyFilters();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update RCI";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRci: async (rciId: string) => {
    set({ isLoading: true, error: null });
    try {
      await RcisServer.deleteRci(rciId);
      set((state) => {
        const updatedRcis = state.rcis.filter((r) => r.id.toString() !== rciId);
        return { rcis: updatedRcis };
      });
      get().applyFilters();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete RCI";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set({
      filters: {
        periodo: "Todos",
        ativo: false,
        condicaoInsegura: null,
        unidade: null,
        nivelRisco: null,
        status: null,
      },
    });
    get().applyFilters();
  },

  applyFilters: () => {
    const { rcis, filters } = get();
    let filtered = [...rcis];

    // Periodo
    const now = new Date();
    if (filters.periodo && filters.periodo !== "Todos") {
      let cutoffDate = new Date();
      switch (filters.periodo) {
        case "Últimas 24 horas":
          cutoffDate.setHours(now.getHours() - 24);
          break;
        case "Últimos 7 dias":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "Últimos 30 dias":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "Últimos 90 dias":
          cutoffDate.setDate(now.getDate() - 90);
          break;
        default:
          cutoffDate = new Date(0);
      }
      filtered = filtered.filter((rci) => rci.dtcriacao >= cutoffDate);
    }

    // Ativo (Assuming it means not finalized/rejected)
    if (filters.ativo) {
      filtered = filtered.filter(
        (rci) => !["Finalizado", "Rejeitado"].includes(rci.status)
      );
    }

    // Condicao Insegura
    if (filters.condicaoInsegura) {
      filtered = filtered.filter(
        (rci) =>
          rci.condicao_insegura === filters.condicaoInsegura ||
          rci.condicao_insegura.id === filters.condicaoInsegura?.id
      );
    }

    // Unidade
    if (filters.unidade) {
      filtered = filtered.filter(
        (rci) =>
          rci.unidade === filters.unidade ||
          rci.unidade.id === filters.unidade?.id
      );
    }

    // Nivel Risco
    if (filters.nivelRisco) {
      filtered = filtered.filter(
        (rci) =>
          rci.nivel_risco === filters.nivelRisco ||
          rci.nivel_risco.id === filters.nivelRisco?.id
      );
    }

    // Status
    if (filters.status) {
      filtered = filtered.filter((rci) => rci.status === filters.status);
    }

    set({ filteredRcis: filtered });
  },
}));
