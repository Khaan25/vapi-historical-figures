import type { NextConfig } from "next";

if(!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
    new URL('https://cdn.midjourney.com/**'),
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', ''),
        port: '',
        pathname: '/**',
      },

    ],
  },
};

export default nextConfig;
