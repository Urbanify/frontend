import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntl({
    eslint: {
      dirs: ['.'],
    },

    env: {
      NEXT_PUBLIC_IMGBB_KEY: process.env.NEXT_PUBLIC_IMGBB_KEY,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      API_URL: process.env.API_URL,
    },
    images: {
      remotePatterns: [
        {
          hostname: '**',
          protocol: 'https',

        },
        {
          hostname: '**',
          protocol: 'http',

        },
      ],
    },
    poweredByHeader: false,
    reactStrictMode: true,
  }),
);
