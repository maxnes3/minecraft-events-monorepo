import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Roboto } from 'next/font/google';
import { FaviconStaticPath } from '@app/shared/ui/static';
import { publicRuntimeConfig } from '@app/shared/config';
import './styles/globals.scss';

const font = Roboto({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--str-font-primary',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif'
  ]
});

export const metadata: Metadata = {
  title: publicRuntimeConfig.application.name,
  icons: {
    icon: [
      {
        url: FaviconStaticPath,
        type: 'image/svg+xml'
      }
    ],
    shortcut: FaviconStaticPath,
    apple: [
      {
        url: FaviconStaticPath,
        sizes: '180x180',
        type: 'image/svg+xml'
      }
    ]
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang =
    cookieStore.get(publicRuntimeConfig.i18n.cookieName)?.value ||
    publicRuntimeConfig.i18n.fallbackLanguage;

  return (
    <html lang={lang} dir="ltr">
      <body className={font.className}>{children}</body>
    </html>
  );
}
