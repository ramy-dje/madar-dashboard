/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // disables type checking during build
  },
  images: {
    remotePatterns: [
      {
        hostname: "pub-675ee3f62a2541d980ea75781400b0ed.r2.dev",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "cloud.blackandyellow.agency",
      },
    ],
  },
};

export default nextConfig;
