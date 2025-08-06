/** 
 * 🚀 Next.js Vibecoding Configuration
 * 
 * Optimized config for rapid development with Claude Code subagents.
 * Perfect for vibecoding sessions and live coding demos.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router (default in Next.js 13+)
  experimental: {
    typedRoutes: true, // Type-safe routing
  },

  // Performance optimizations for vibecoding
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Images optimization
  images: {
    domains: [
      'localhost',
      'via.placeholder.com', // For demos
      'picsum.photos', // For demos
      'images.unsplash.com', // For demos
    ],
  },

  // ESLint
  eslint: {
    dirs: ['app', 'components', 'hooks', 'lib', 'providers'],
  },

  // TypeScript
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Headers for better development experience
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  // Redirects for better UX
  async redirects() {
    return [
      // Add custom redirects here for vibecoding demos
    ];
  },
};

module.exports = nextConfig;