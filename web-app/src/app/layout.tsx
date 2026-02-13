import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
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
        url: `${publicRuntimeConfig.static.icons}/favicon.svg`,
        type: 'image/svg+xml'
      }
    ],
    shortcut: `${publicRuntimeConfig.static.icons}/favicon.svg`,
    apple: [
      {
        url: `${publicRuntimeConfig.static.icons}/favicon.svg`,
        sizes: '180x180',
        type: 'image/svg+xml'
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={font.className}>{children}</body>
    </html>
  );
}
