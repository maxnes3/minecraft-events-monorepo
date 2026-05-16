import { Request } from 'express';

export function normalizeHttpRequestHeaders(
  request: Request
): Record<string, string> {
  if (!request?.headers) {
    return {};
  }

  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') {
      normalized[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      normalized[key] = value[0];
    } else if (value !== undefined) {
      normalized[key] = String(value);
    }
  }
  return normalized;
}
