import { create } from "zustand";
import { persist } from "zustand/middleware";

import AuthServer from "../servers/AuthServer";

import { type Colaborador } from "../schemas/colaboradorSchema";
import { type LoginCredentials, type Token } from "../schemas/authSchemas";

interface AuthState {
  colaborador: Colaborador | null;
  token: Token | null;
  isLoading: boolean;
  isHydrated: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  getCurrentUser: () => Promise<Colaborador | null>;
  checkSuperUser: (username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearAuth: () => void;
  reset: () => void;
}

const initialState = {
  colaborador: null,
  token: null,
  isLoading: false,
  isHydrated: false,
  isAuthenticated: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          const data = await AuthServer.login({
            username: credentials.username,
            password: credentials.password,
          });
          set({ token: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            ...initialState, // Reset state on failure
            error: error instanceof Error ? error.message : "Login failed",
          });
          throw error;
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) {
            return Promise.resolve(null);
          }
          return AuthServer.fetchUser(token.id).then((user) => {
            set({ colaborador: user, isLoading: false, isHydrated: true });
            return user;
          });
        } catch (error) {
          set({
            ...initialState, // Reset state on failure
            error: error instanceof Error ? error.message : "Fetch user failed",
          });
          throw error;
        }
      },

      checkSuperUser: async (username: string): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          return await AuthServer.getGroups(username);
        } catch (error) {
          set({
            ...initialState, // Reset state on failure
            error: error instanceof Error ? error.message : "Check failed",
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          //   const { token } = get();

          // Invalidate token on server
          //   await AuthServer.logout({ token: token! });

          // Clear all user-specific stores

          // Clear localStorage for all user-specific data

          // Reset auth store to initial state
          set(initialState);
        } catch (error) {
          console.error("Logout failed:", error);
          // Still clear state even if server logout fails
          set(initialState);
          throw error;
        }
      },

      hydrate: async () => {
        set({ isLoading: true, error: null });
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, isHydrated: true });
          return;
        }

        try {
          const token = get().token;
          console.log("Hydrating auth store with token:", token);
          // Simple validation: check token presence and expiry
          // When in production, verify token signature and claims properly
          if (!token) {
            get().logout(); // Token is expired, log out
          } else {
            set({ isAuthenticated: true, isHydrated: true }); // Token is valid
          }
          get().logout(); // For security, log out any persisted token
        } catch (error) {
          // If token is malformed, treat as invalid and log out
          console.error("Failed to decode token during hydration:", error);
          get().logout();
          throw error;
        } finally {
          set({ isHydrated: true }); // Always mark hydration complete
        }
      },

      clearAuth: () => {
        set({ error: null });
      },

      reset: () => set(initialState),
    }),
    {
      name: "auth-storage", // localStorage key
      // Persist only the token and user data
      partialize: (state) => ({
        token: state.token,
        colaborador: state.colaborador,
      }),
    }
  )
);
