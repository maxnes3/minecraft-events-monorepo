import { HttpRequestConfig } from './http-request-config.interface';
import { HttpResponse } from './http-response.interface';

export interface IHttpClient {
  get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  setDefaultHeader(key: string, value: string): void;
  setDefaultHeaders(headers: Record<string, string>): void;
  removeDefaultHeader(key: string): void;
  clearDefaultHeaders(): void;

  setDefaultConfig(config: Partial<HttpRequestConfig>): void;
  clearDefaultConfig(): void;
}
