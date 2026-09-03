import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongodb"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/syllabus",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
