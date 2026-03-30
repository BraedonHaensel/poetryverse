import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_API_URL ?? 'localhost:3001',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
