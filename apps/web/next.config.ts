import type { NextConfig } from 'next'

const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
)

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
        protocol: apiUrl.protocol === 'https:' ? 'https' : 'http',
        hostname: apiUrl.hostname,
        port: apiUrl.port || '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
