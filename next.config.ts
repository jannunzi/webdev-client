import path from "node:path";
import type { NextConfig } from "next";

const inlineEditLoader = path.join(process.cwd(), "lib/inline-edit/loader.cjs");

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongodb"],
  turbopack: {
    rules: {
      "*.tsx": {
        condition: {
          all: [{ not: "foreign" }, { path: /^app\/book\/.*\.tsx$/ }],
        },
        loaders: [inlineEditLoader],
      },
      "*.ts": {
        condition: {
          all: [{ not: "foreign" }, { path: /^lib\/lectures\/decks\/.*\.ts$/ }],
        },
        loaders: [inlineEditLoader],
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(tsx|ts)$/,
      enforce: "pre",
      include: [
        path.join(process.cwd(), "app/book"),
        path.join(process.cwd(), "lib/lectures/decks"),
      ],
      use: [inlineEditLoader],
    });
    return config;
  },
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
      {
        source: "/project/piazza",
        destination: "/project/pazza",
        permanent: false,
      },
      {
        source: "/slides/tailwind-flex-and-grid",
        destination: "/slides/tailwind-filters-and-grid",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
