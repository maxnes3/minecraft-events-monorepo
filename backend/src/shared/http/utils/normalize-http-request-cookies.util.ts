import { Request } from 'express';

export function normalizeHttpRequestCookies(
  request: Request
): Record<string, string> {
  if (!request.cookies || typeof request.cookies !== 'object') {
    return {};
  }

  const cookies = request.cookies as Record<string, unknown>;
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(cookies)) {
    if (typeof value === 'string') {
      normalized[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      const first = value.find((v) => typeof v === 'string');
      if (first) normalized[key] = first;
      continue;
    }

    if (
      value &&
      typeof value === 'object' &&
      'toString' in value &&
      value.constructor === Object
    ) {
      normalized[key] = JSON.stringify(value);
      continue;
    }
  }
  return normalized;
}
