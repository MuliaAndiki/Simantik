import type { NextConfig } from 'next';
import { env } from '@/configs/env.config';

const sharpTracingIncludes = [
  './node_modules/@img/sharp-libvips-linux-x64/**/*',
  './node_modules/@img/sharp-linux-x64/**/*',
  ...(!process.env.VERCEL
    ? [
        './node_modules/@img/sharp-libvips-linuxmusl-x64/**/*',
        './node_modules/@img/sharp-linuxmusl-x64/**/*',
      ]
    : []),
];

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@aws-sdk/client-s3', 'sharp'],
  outputFileTracingIncludes: {
    '/**': sharpTracingIncludes,
  },
  images: {
    // Unoptimized untuk development, optimized untuk production
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simantik.id',
      },
      {
        protocol: 'https',
        hostname: '*.simantik.id',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: env.NEXT_PUBLIC_BASEPATH || '/home',
        permanent: true,
      },
      {
        source: '/auth/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  // Tambahkan configuration untuk headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
