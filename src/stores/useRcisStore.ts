import { create } from "zustand";

import RcisServer from "../servers/RcisServer";

import { useAppStore } from "./useAppStore";

import { orderByDate } from "../utils/listsUtil";

import type { Rci, RciCreate, RciLog, RciUpdate } from "../schemas/rciSchemas";
import type {
  CondicaoInsegura,
  DateRange,
  NivelRisco,
  PaginationMeta,
  Unidade,
} from "../schemas/stateSchemas";
import type { RciStatus } from "../schemas/enums";
import XlsxAdapter from "../adapters/XlsxAdapter";

export interface RciFilters {
  periodo: DateRange | null;
  ativo: boolean;
  condicaoInsegura: CondicaoInsegura | null;
  unidade: Unidade | null;
  nivelRisco: NivelRisco | null;
  status: RciStatus | null;
  search: string;
}

interface RciState {
  rcis: Rci[];
  filteredRcis: Rci[];
  filters: RciFilters;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;

  fetchRcis: (userId: string) => Promise<void>;
  fetchRciHistory: (rciId: string) => Promise<RciLog[]>;
  createRci: (rciData: RciCreate) => Promise<void>;
  updateRci: (rciId: string, rciData: RciUpdate) => Promise<void>;
  deleteRci: (rciId: string) => Promise<void>;

  setFilter: <K extends keyof RciFilters>(key: K, value: RciFilters[K]) => void;
  setPage: (page: number) => void;
  exportRcisToExcel: (filename: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useRcisStore = create<RciState>((set, get) => ({
  rcis: [],
  filteredRcis: [],
  filters: {
    periodo: null,
    ativo: true,
    condicaoInsegura: null,
    unidade: null,
    nivelRisco: null,
    status: null,
    search: "",
  },
  pagination: {
    page: 1,
    per_page: useAppStore.getState().windowSize.height <= 1070 ? 12 : 7,
    total: 0,
    total_pages: 0,
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

  fetchRciHistory: async (rciId: string) => {
    set({ isLoading: true, error: null });
    try {
      const history = await RcisServer.fetchRciLogs(rciId);
      return history;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch RCI history";
      set({ error: message });
      return [];
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
    // TODO: Add 'periodo' filter by date range
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().applyFilters();
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
  },

  exportRcisToExcel: (filename: string) => {
    const { filteredRcis } = get();

    console.log("Exporting RCIs to Excel:", filteredRcis.length);

    if (filteredRcis.length === 0) {
      set({ error: "Nenhuma tarefa para exportar" });
      return;
    }

    try {
      XlsxAdapter.exportToExcel(
        filteredRcis,
        [
          { header: "ID", accessor: (t) => t.id },
          { header: "Unidade", accessor: (t) => t.unidade.sigla },
          { header: "Setor", accessor: (t) => t.setor.setor.nome },
          {
            header: "Responsável",
            accessor: (t) => t.setor.responsavel.first_name,
          },
          {
            header: "Grau de Risco",
            accessor: (t) =>
              `${t.nivel_risco.severidade}${t.nivel_risco.severidade}` || "",
          },
          { header: "Ocorrência", accessor: (t) => t.condicao_insegura.nome },
          { header: "Autor", accessor: (t) => t.autor.first_name },
          { header: "Status", accessor: (t) => t.status },
          {
            header: "Criado em",
            accessor: (t) => t.dtcriacao.toLocaleString(),
            format: (value) =>
              value
                ? new Date(value as string).toLocaleDateString("pt-BR")
                : "",
          },
          {
            header: "Prazo",
            accessor: (t) => t.data_limite.toLocaleString(),
            format: (value) =>
              value
                ? new Date(value as string).toLocaleDateString("pt-BR")
                : "",
          },
        ],
        filename
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao exportar tarefas";

      set({ error: errorMessage });
      throw error;
    }
  },

  clearFilters: () => {
    set({
      filters: {
        periodo: null,
        ativo: true,
        condicaoInsegura: null,
        unidade: null,
        nivelRisco: null,
        status: null,
        search: "",
      },
    });
    get().applyFilters();
  },

  applyFilters: () => {
    const { rcis, filters } = get();
    let filtered = [...rcis];

    // Periodo
    if (filters.periodo && filters.periodo !== null) {
      filtered = filtered.filter(
        (rci) =>
          rci.dtcriacao >= (filters.periodo?.startDate ?? new Date(0)) &&
          rci.dtcriacao <= (filters.periodo?.endDate ?? new Date())
      );
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

    // Global Search
    if (filters.search && filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((rci) => {
        const unidadeMatch =
          rci.unidade.nome.toLowerCase().includes(searchLower) ||
          rci.unidade.sigla.toLowerCase().includes(searchLower);
        const ocorrenciaMatch = rci.condicao_insegura.nome
          .toLowerCase()
          .includes(searchLower);
        const autorMatch =
          rci.autor.first_name.toLowerCase().includes(searchLower) ||
          rci.autor.username.toLowerCase().includes(searchLower);
        const responsavelMatch = rci.setor.responsavel.first_name
          .toLowerCase()
          .includes(searchLower);
        const setorMatch = rci.setor.setor.nome
          .toLowerCase()
          .includes(searchLower);

        return (
          unidadeMatch ||
          ocorrenciaMatch ||
          autorMatch ||
          responsavelMatch ||
          setorMatch
        );
      });
    }

    const total = filtered.length;
    const per_page = get().pagination.per_page;
    const total_pages = Math.ceil(total / per_page);

    set({
      filteredRcis: filtered,
      pagination: {
        ...get().pagination,
        total,
        total_pages,
        page: 1,
      },
    });
  },
}));
