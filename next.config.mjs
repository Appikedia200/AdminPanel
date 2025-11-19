/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Cloudflare Pages optimization - disable cache in output
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Disable webpack cache for production builds
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.cache = false
    }
    return config
  },
}

export default nextConfig
