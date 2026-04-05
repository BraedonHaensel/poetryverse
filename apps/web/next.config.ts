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
      // Proxy to get profile images from the api.
      {
        source: '/images/:path*',
        destination: `${internalApiUrl.origin}/images/:path*`,
      },
      // Keep NextAuth routes on the Next.js app.
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      // Proxy all other API routes to the backend service.
      {
        source: '/api/:path*',
        destination: `${internalApiUrl.origin}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
