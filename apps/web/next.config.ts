import type { NextConfig } from 'next'

const internalApiUrl = new URL(
  process.env.NEXT_INTERNAL_API_URL ?? 'http://localhost:3001'
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
        protocol: internalApiUrl.protocol === 'https:' ? 'https' : 'http',
        hostname: internalApiUrl.hostname,
        port: internalApiUrl.port || '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${internalApiUrl.origin}/images/:path*`,
      },
    ]
  },
}

export default nextConfig
