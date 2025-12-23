import apiClient, { type ApiError } from "../api/apiClient";
import type { ImageMetadata } from "../schemas/stateSchemas";

class AppServer {
  static instance: AppServer;

  private constructor() {}

  public static getInstance(): AppServer {
    if (!AppServer.instance) {
      AppServer.instance = new AppServer();
    }
    return AppServer.instance;
  }

  public async fetchCondicoesInseguras() {
    try {
      const response = await apiClient.get("/v1/condicao_insegura/");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching unsafe conditions:", apiError);
      throw apiError;
    }
  }

  public async fetchUnidades() {
    try {
      const response = await apiClient.get("/v1/unidade/");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching units:", apiError);
      throw apiError;
    }
  }

  public async fetchNiveisDeRisco() {
    try {
      const response = await apiClient.get("/v1/nivel_risco/");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching risk levels:", apiError);
      throw apiError;
    }
  }

  public async fetchSetores(unidadeId: string) {
    try {
      const response = await apiClient.get(
        `/v1/unidade_setor/por_unidade/${unidadeId}/`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching sectors:", apiError);
      throw apiError;
    }
  }

  public async fetchImage(url: string): Promise<Blob> {
    try {
      const response = await apiClient.get(url, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching image:", apiError);
      throw apiError;
    }
  }

  public async uploadImage(image: File): Promise<{ imageUrl: ImageMetadata }> {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await apiClient.post("/v1/upload_image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error uploading image:", apiError);
      throw apiError;
    }
  }
}

export default AppServer.getInstance();
