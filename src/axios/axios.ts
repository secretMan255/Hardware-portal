import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export class AxiosClient {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_BEREAR_TOKEN}`,
        },
      });

      this.instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => config,
        (error) => Promise.reject(error)
      );

      this.instance.interceptors.response.use(
        (response: AxiosResponse) => response.data, // Keep full response
        (error) => Promise.reject(error)
      );
    }
    return this.instance;
  }
}
