/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  serverExternalPackages: ['marked'],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
