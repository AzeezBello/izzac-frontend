// next.config.ts

const defaultApiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://izzac-backend.vercel.app").replace(/\/+$/, "");
const apiEndpoint = new URL(defaultApiUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: apiEndpoint.protocol.replace(":", ""),
        hostname: apiEndpoint.hostname,
        port: apiEndpoint.port,
        pathname: "/media/**", // Adjust the pathname as needed to match your image paths
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: defaultApiUrl,
  },
  productionBrowserSourceMaps: false, // Disable production source maps
};

module.exports = nextConfig;
