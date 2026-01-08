export interface HttpRequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  data?: any;
  timeout?: number;
}
