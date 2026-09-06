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
      {
        source: "/lectures",
        destination: "/slides",
        permanent: true,
      },
      {
        source: "/lectures/:slug",
        destination: "/slides/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
