/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    globalNotFound: true,
  },
};

module.exports = nextConfig;
