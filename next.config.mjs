/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig

