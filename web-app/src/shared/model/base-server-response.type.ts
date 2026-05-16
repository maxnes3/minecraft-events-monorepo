export interface BaseServerResponse<T = any> {
  success: boolean;
  data: T | undefined;
  error: string | null;
}
