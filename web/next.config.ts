import type { NextConfig } from 'next';
import { env } from '@/configs/env.config';

const getR2RemotePattern = () => {
  try {
    if (env.NEXT_PUBLIC_R2_URL) {
      const parsed = new URL(env.NEXT_PUBLIC_R2_URL);
      return [
        {
          protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
          hostname: parsed.hostname,
          pathname: '/**',
        },
      ];
    }
  } catch {
    // Fallback if URL parsing fails
  }
  return [];
};

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@aws-sdk/client-s3'],
  images: {
    remotePatterns: [
      ...getR2RemotePattern(),
      {
        protocol: 'https',
        hostname: '**.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**',
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
    ];
  },
};

export default nextConfig;
