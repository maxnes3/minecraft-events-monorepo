import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        /* Twitch Images */
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        port: '',
        pathname: '/**'
      },
      {
        /* Youtube Images */
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        pathname: '/**'
      }
    ]
  },
  devIndicators: false
};

export default nextConfig;
