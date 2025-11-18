/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: For Cloudflare Pages deployment with dynamic routes,
  // use their Node.js adapter instead of static export
  // See: https://developers.cloudflare.com/pages/framework-guides/nextjs/
  
  images: {
    unoptimized: true, // Cloudflare handles image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  typescript: {
    ignoreBuildErrors: false, // Fail build on TypeScript errors
  },
  
  eslint: {
    ignoreDuringBuilds: false, // Fail build on ESLint errors
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig

