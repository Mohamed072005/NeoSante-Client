import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        domains: ["neo-sante-app.s3.us-east-1.amazonaws.com"], // Add your S3 domain here
    },
};

export default nextConfig;
