import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';

import '@/styles/global.css';

import { Toaster } from '@/components/ui/toaster/toaster';

import PACKAGE from '../../package.json';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

const siteConfig = {
  title: 'Urbanify',
  description:
    'Urbanify description',
  url: 'https://urbanify.com.br',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.png`],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.png`],
    creator: '@fixedMyCity',
  },
  authors: [
    {
      name: 'Urbanify',
      url: 'https://urbanify.com.br',
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang="pt-BR" className={`size-full ${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta name="version" content={PACKAGE.version} key="meta:name:version" />
      <body data-testid="rootlayout-component" className="size-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <main>{children}</main>
            <Toaster richColors />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
