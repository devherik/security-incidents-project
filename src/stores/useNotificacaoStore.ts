import { create } from "zustand";

import { NotificationSchema } from "../schemas/authSchemas";
import AuthServer from "../servers/AuthServer";

import type { Notification } from "../schemas/authSchemas";

interface NotificacaoState {
  notificacoes: Notification[];
  fetchNotificacoes: (userId: number) => Promise<void>;
  marcarComoLida: (notificacaoId: number) => Promise<void>;
  marcarTodasComoLidas: (userId: number) => Promise<void>;
}

const initialState = {
  notificacoes: [],
};

export const useNotificacaoStore = create<NotificacaoState>((set, get) => ({
  // Initialize state
  ...initialState,

  fetchNotificacoes: async (userId: number) => {
    try {
      const response = await AuthServer.getUserNotifications(userId);
      const notificacoes = response.map((notificacao) =>
        NotificationSchema.parse(notificacao)
      );
      set({ notificacoes });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  },
  
  marcarComoLida: async (notificacaoId: number) => {
    try {
      await AuthServer.markNotificationsAsRead(notificacaoId);
      const updatedNotificacoes = get().notificacoes.map((notificacao) =>
        notificacao.id === notificacaoId
          ? { ...notificacao, lida: true }
          : notificacao
      );
      set({ notificacoes: updatedNotificacoes });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  marcarTodasComoLidas: async () => {
    try {
      const notificacoes = get().notificacoes;
      const updatedNotificacoes = notificacoes.map(
        (notificacao) => (
          get().marcarComoLida(notificacao.id), { ...notificacao, lida: true }
        )
      );
      set({ notificacoes: updatedNotificacoes });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },
}));
