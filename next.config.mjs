import crypto from 'crypto';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'partyslate.imgix.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80, 90, 95],
  },
  //   output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // This is a key optimization that works with Turbopack
  },
  reactCompiler: true,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    // This optimization works with Turbopack
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
    // This flag is specific to Turbopack
    turbopackFileSystemCacheForDev: true,
    // Enable View Transitions API support
    viewTransition: true,
  },

  // This is the new flag for PPR, which Turbopack supports
  cacheComponents: true,

  //
  // ⛔️ The 'webpack' function has been removed. ⛔️
  //
  // Turbopack is the default bundler in Next.js 16
  // and does not use this configuration. It handles
  // code splitting and chunking automatically.
  //

  // Headers configuration remains the same
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
