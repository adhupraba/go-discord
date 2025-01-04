/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "uploadthing.com" }, { hostname: "utfs.io" }],
  },
};

module.exports = nextConfig;
