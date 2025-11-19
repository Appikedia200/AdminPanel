/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages deployment configuration
  images: {
    unoptimized: true, // Cloudflare handles image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudflare.com',
      },
    ],
  },
  
  // TypeScript and ESLint strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Best practices
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig

