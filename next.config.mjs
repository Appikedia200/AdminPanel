/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow build to continue even with dynamic route warnings
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
