import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: { "/assessment": ["./config/capstone-v1/*.json"] },
};

export default nextConfig;
