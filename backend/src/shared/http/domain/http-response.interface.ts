export interface HttpResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
}
