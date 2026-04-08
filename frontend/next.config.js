/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
}

module.exports = nextConfig
