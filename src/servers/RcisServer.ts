import apiClient, { type ApiError } from "../api/apiClient";

import type { Rci, RciCreate, RciLog, RciUpdate } from "../schemas/rciSchemas";

class RciServer {
  static instance: RciServer;

  private constructor() {}

  public static getInstance(): RciServer {
    if (!RciServer.instance) {
      RciServer.instance = new RciServer();
    }
    return RciServer.instance;
  }

  public async fetchUserRcis(userId: string) {
    try {
      const response = await apiClient.get(`/v2/rcis/users/${userId}`);
      return response.data as Rci[];
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching RCIs:", apiError);
      throw apiError;
    }
  }

  public async fetchRciLogs(rciId: string) {
    try {
      const response = await apiClient.get<RciLog[]>(`/v2/rcis/logs/${rciId}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching RCI history:", apiError);
      throw apiError;
    }
  }

  public async createRci(rciData: RciCreate) {
    try {
      const response = await apiClient.post("/v1/rci/", rciData);
      return response.data as Rci;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error creating RCI:", apiError);
      throw apiError;
    }
  }

  public async updateRci(rciId: string, rciData: RciUpdate) {
    try {
      const response = await apiClient.put(`/v1/rci/${rciId}/`, rciData);
      return response.data as Rci;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error updating RCI:", apiError);
      throw apiError;
    }
  }

  public async deleteRci(rciId: string) {
    try {
      await apiClient.delete(`/v1/rci/${rciId}/`);
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error deleting RCI:", apiError);
      throw apiError;
    }
  }
}

export default RciServer.getInstance();
