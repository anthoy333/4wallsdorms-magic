import path from "path"
import { fileURLToPath } from "url"

// Lock tracing to this app so Next doesn't pick a parent folder that has its own package-lock.json
// (e.g. C:\Users\Natal\package-lock.json), which triggers the "inferred workspace root" warning.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
