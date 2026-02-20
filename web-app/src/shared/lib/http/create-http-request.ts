import { publicRuntimeConfig } from '@app/shared/config';
import { RequestMethod } from './request-method.enum';
import { type RequestOptions } from './request-options.type';

const ALLOWED_BODY_METHODS_LIST = [
  RequestMethod.POST,
  RequestMethod.PUT,
  RequestMethod.PATCH
];

export function createHttpRequest<T = any>({
  method,
  url: initUrl,
  baseUrl,
  options: initOptions
}: {
  method: RequestMethod;
  url?: string;
  baseUrl?: string;
  options?: RequestOptions;
}) {
  return async (args: { url?: string; options?: RequestOptions }) => {
    const { url, options } = args;

    const endPointUrl = url || initUrl;
    if (!endPointUrl) {
      return;
    }

    const base = baseUrl || publicRuntimeConfig.server.apiUrl || '';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanUrl = endPointUrl.startsWith('/')
      ? endPointUrl.slice(1)
      : endPointUrl;
    const fetchUrl = `${cleanBase}/${cleanUrl}`;

    const urlObject = new URL(fetchUrl);

    const params = new URLSearchParams();

    if (initOptions?.params) {
      Object.entries(initOptions.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }

    if (Array.from(params).length > 0) {
      urlObject.search = params.toString();
    }

    const finalUrl = urlObject.toString();

    let body: BodyInit | undefined = undefined;
    if (ALLOWED_BODY_METHODS_LIST.includes(method)) {
      const bodyData = options?.body || initOptions?.body;

      if (bodyData) {
        if (
          typeof bodyData === 'object' &&
          !(bodyData instanceof FormData) &&
          !(bodyData instanceof URLSearchParams)
        ) {
          body = JSON.stringify(bodyData);
        } else {
          body = bodyData as BodyInit;
        }
      }
    }

    const headers = {
      ...initOptions?.headers,
      ...options?.headers
    };

    const response = await fetch(finalUrl, {
      method,
      body,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as T;
    return data;
  };
}
