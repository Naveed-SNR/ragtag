import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  module.exports = {
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://leadsync.onrender.com'
        : 'http://localhost:8000'
    );
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`, // Proxy to Backend
      },
    ]
  },
}
};

export default nextConfig;
