// src/services/apiModulesService.ts
import { apiRequest } from "./apiClient";

export interface ApiModuleCallOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string | number | boolean | undefined>;
}

export const apiModulesService = {
  fetchApiModuleData: async <T = any>({
    url,
    method = "GET",
    headers,
    body,
    query,
  }: ApiModuleCallOptions): Promise<T> => {
    return apiRequest<T>(url, {
      method,
      headers,
      body,
      query,
      skipAuth: true, // attach token if available
    });
  },
};
