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
