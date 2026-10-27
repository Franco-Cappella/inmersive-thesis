import type { NextConfig } from "next";

// Export estático: `npm run build` genera out/ (HTML + JS + CSS) que corre con
// cualquier servidor estático y sin conexión, que es lo que pide la defensa.
// Por eso no se usan cacheComponents ni nada que necesite un servidor de Next.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  devIndicators: false,
};

export default nextConfig;
