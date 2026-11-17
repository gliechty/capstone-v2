import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["playwright-core"],
  distDir: process.env.CAPSTONE_BUILD_TARGET === "private-preview" ? ".next-preview" : ".next",
  env: { CAPSTONE_PREVIEW_BUILD: process.env.CAPSTONE_BUILD_TARGET === "private-preview" ? "1" : "0" },
  outputFileTracingIncludes: { "/assessment": ["./config/capstone-v1/*.json"] },
};

export default nextConfig;
