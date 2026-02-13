export function setCookie(
  key: string,
  value: string,
  expiresIn: number = 86400
) {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + expiresIn * 1000);

  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}
