import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros do ESLint durante o build de produção
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros do TypeScript durante o build de produção
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

