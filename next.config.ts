import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/place/photo**',
      },
    ],
  },
  // Vercel 優化設定
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // 環境變數配置
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
  },
  // 建置優化
  swcMinify: true,
  compress: true,
  // 輸出配置
  output: 'standalone',
};

export default nextConfig;
