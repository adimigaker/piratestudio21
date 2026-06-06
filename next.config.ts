import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Agar sitemap selalu di-render ulang saat diakses
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig