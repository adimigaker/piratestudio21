/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig