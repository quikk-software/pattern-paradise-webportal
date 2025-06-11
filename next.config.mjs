import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**',
        search: '',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
