export function formatedHttpResponse<T = any>(data: {
  success: boolean;
  data?: T;
  error?: string;
}) {
  return {
    success: data.success,
    data: data.data ?? {},
    error: data.error ?? null
  };
}
