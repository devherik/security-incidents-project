import apiClient, { type ApiError } from "../api/apiClient";

import type { Token } from "../schemas/authSchemas";
import type {
  Colaborador,
  ColaboradorUpdate,
} from "../schemas/colaboradorSchema";

class AuthServer {
  static instance: AuthServer;

  private constructor() {}

  public static getInstance(): AuthServer {
    if (!AuthServer.instance) {
      AuthServer.instance = new AuthServer();
    }
    return AuthServer.instance;
  }

  public async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<Token> {
    try {
      // Prepare form data for OAuth2 password grant
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("grant_type", "password");
      formData.append("client_id", import.meta.env.VITE_APP_AUTH0_CLIENT_ID);
      formData.append("client_secret", import.meta.env.VITE_APP_CLIENT_SECRET);
      const response = await apiClient.post<Token>("/o/token/", formData, {
        baseURL: "",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to authenticate");
      }

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error logging in:", apiError);
      throw apiError;
    }
  }

  public async fetchUser(userId: number): Promise<Colaborador> {
    try {
      const response = await apiClient.get<Colaborador>(
        `/v1/usuario/${userId}/`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching user:", apiError);
      throw error;
    }
  }

  public async updateUser(
    userId: number,
    data: Partial<ColaboradorUpdate>
  ): Promise<Colaborador> {
    try {
      const response = await apiClient.patch<Colaborador>(
        `/v1/usuario/${userId}/`,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error updating user:", apiError);
      throw error;
    }
  }

  public async getGroups(name: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/v2/user_groups/${name}`);
      const type = response.data.groups[0];
      const isSuperUserResponse = type === 3 || type === 2 || type === 4;
      return isSuperUserResponse;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error checking super user status:", apiError);
      return false;
    }
  }

  public async logout({ token }: { token: string }): Promise<void> {
    try {
      // Prepare form data for OAuth2 token revocation
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("client_id", import.meta.env.VITE_APP_AUTH0_CLIENT_ID);
      formData.append("client_secret", import.meta.env.VITE_APP_CLIENT_SECRET);

      // Call logout endpoint to invalidate token on the server
      await apiClient.post("/o/revoke_token/", formData, {
        baseURL: "",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Token successfully revoked on the server.");
    } catch (error) {
      console.error("Error during server logout:", error);
      // We still proceed to local cleanup even if server revocation fails,
      // to ensure the user is logged out on the client-side.
    } finally {
      // This part is now handled by the Zustand store's reset mechanism,
      // but leaving it here can be a fallback if the server is called directly.
      this.clearLocalAuth();
    }
  }

  private clearLocalAuth(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("userInfo");
  }

  public async validateToken({
    token,
  }: {
    token?: string;
  }): Promise<Token | null> {
    try {
      if (!token) {
        return null;
      }
      // Prepare form data for OAuth2 token validation
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("client_id", import.meta.env.VITE_APP_AUTH0_CLIENT_ID);
      formData.append("client_secret", import.meta.env.VITE_APP_CLIENT_SECRET);

      // Verify token with server
      const response = await apiClient.post<Token>("/o/introspect/", formData, {
        baseURL: "",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking authentication status:", error);
      // If verification fails, clear local auth
      this.clearLocalAuth();
      return null;
    }
  }

  public async getUserNotifications(userId: number): Promise<Notification[]> {
    try {
      const response = await apiClient.get<Notification[]>(
        `/v2/notifications/${userId}/`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching user notifications:", apiError);
      throw error;
    }
  }

  public async markNotificationsAsRead(userId: number): Promise<void> {
    try {
      await apiClient.patch(`/v2/notification_read/${userId}/`);
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error marking notifications as read:", apiError);
      throw error;
    }
  }
}

export default AuthServer.getInstance();
