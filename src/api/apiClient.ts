import axios, { type AxiosResponse, AxiosError } from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useAppStore } from "../stores/useAppStore";

// Types for better type safety (following Interface Segregation Principle)
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Type for API error responses (defensive programming)
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  code?: string;
}

// Type guard to safely check if response data has error properties
const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return typeof data === "object" && data !== null;
};

// Extend Axios config to include metadata
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// Configuration constants
const API_CONFIG = {
  baseURL: "/api",
  timeout: 10000, // 10 seconds timeout
  retries: 3,
} as const;

// Create the main API client instance
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request logging in development
    if (import.meta.env.MODE === "development") {
      console.log(
        `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    // Add timestamp for request tracking
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Helper function to safely extract error message from response data
const extractErrorMessage = (
  data: unknown,
  fallbackMessage: string
): string => {
  if (!isApiErrorResponse(data)) {
    return fallbackMessage;
  }

  // Check for common error message properties in order of preference
  return data.message || data.detail || data.error || fallbackMessage;
};

// Helper function to safely extract error code from response data
const extractErrorCode = (data: unknown): string | undefined => {
  if (!isApiErrorResponse(data)) {
    return undefined;
  }

  return data.code;
};

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.MODE === "development") {
      const duration =
        new Date().getTime() -
        (response.config.metadata?.startTime?.getTime() || 0);
      console.log(`✅ API Success: ${response.status} - ${duration}ms`);
    }

    return response;
  },
  (error: AxiosError) => {
    // Enhanced error handling following defensive programming principles
    const apiError: ApiError = {
      message: "Erro desconhecido",
      status: 0,
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      apiError.status = status;

      // Safely extract error information using type guards
      const fallbackMessage = getErrorMessage(status);
      apiError.message = extractErrorMessage(data, fallbackMessage);
      apiError.code = extractErrorCode(data);

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - The token is invalid or expired.
          // ACTION: Immediately update the global store.
          console.warn("🔐 Authentication expired - triggering logout");

          // We call the store directly. This updates 'isAuthenticated' to false.
          // Since your UI subscribes to this state, the redirect will happen automatically.
          useAuthStore.getState().logout();
          useAuthStore.getState().isHydrated = true; // Ensure hydrated state
          useAppStore.getState().showToast("Sessão expirada.", "warning");
          break;

        case 403:
          console.warn("🚫 Access forbidden - insufficient permissions");
          useAppStore.getState().showToast("Acesso negado.", "warning");
          break;

        case 500:
          console.error("💥 Server error - please try again later");
          break;
      }
    }
    // ...existing code...
    return Promise.reject(apiError);
  }
);

// Helper function for error messages
function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Dados inválidos enviados";
    case 401:
      return "Credenciais inválidas ou sessão expirada";
    case 403:
      return "Acesso negado";
    case 404:
      return "Recurso não encontrado";
    case 409:
      return "Conflito nos dados";
    case 422:
      return "Dados não processáveis";
    case 500:
      return "Erro interno do servidor";
    case 502:
      return "Servidor indisponível";
    case 503:
      return "Serviço temporariamente indisponível";
    default:
      return `Erro ${status}: Algo deu errado`;
  }
}

export default apiClient;
