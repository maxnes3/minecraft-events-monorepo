import { type CookieData } from './cookie-data.type';

export function getCookie(key: string): CookieData {
  if (typeof document === 'undefined') {
    return { value: undefined, expiresIn: undefined };
  }

  const cookieString = `; ${document.cookie}`;
  const parts = cookieString.split(`; ${key}=`);

  if (parts.length !== 2) {
    return { value: undefined, expiresIn: undefined };
  }

  const cookiePart = parts.pop()?.split(';').shift() || '';
  const value = decodeURIComponent(cookiePart);

  const fullCookie = parts.join(`; ${key}=`) + `; ${key}=${cookiePart}`;
  const expiresMatch = fullCookie.match(/; expires=([^;]+)/);

  let expiresIn: number | undefined;

  if (expiresMatch) {
    const expiresDate = new Date(expiresMatch[1]);
    const now = new Date();
    expiresIn = Math.max(
      0,
      Math.floor((expiresDate.getTime() - now.getTime()) / 1000)
    );
  }

  return { value, expiresIn };
}
