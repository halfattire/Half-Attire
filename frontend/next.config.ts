/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lodash'],
  },
  
  // Turbopack configuration (stable since Next.js 14)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance configurations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Simplified webpack optimizations
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    // Only apply basic optimizations to avoid chunk loading issues
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    
    // Fallback for node modules that might not be available on the client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "**" },
      { protocol: "https", hostname: "indian-retailer.s3.ap-south-1.amazonaws.com", pathname: "**" },
      { protocol: "https", hostname: "www.shift4shop.com", pathname: "**" },
      { protocol: "https", hostname: "img.freepik.com", pathname: "**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "**" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com", pathname: "**" },
      { protocol: "https", hostname: "st-troy.mncdn.com", pathname: "**" },
      { protocol: "https", hostname: "static.vecteezy.com", pathname: "**" },
      { protocol: "https", hostname: "searchspring.com", pathname: "**" },
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "**" },
      { protocol: "https", hostname: "www.startech.com.bd", pathname: "**" },
      { protocol: "https", hostname: "www.hatchwise.com", pathname: "**" },
      { protocol: "https", hostname: "shopo.quomodothemes.website", pathname: "**" },
      { protocol: "https", hostname: "hamart-shop.vercel.app", pathname: "**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "**" },
      { protocol: "https", hostname: "i5.walmartimages.com", pathname: "**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "lh4.googleusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "lh6.googleusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "googleusercontent.com", pathname: "**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "**" },
    ],
  },
};

export default nextConfig;
