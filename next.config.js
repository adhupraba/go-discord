/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["uploadthing.com", "utfs.io"],
  },
  rewrites: async () => {
    return [{ source: "/api/gateway/:path*", destination: `${process.env.API_URL}/:path*` }];
  },
};

module.exports = nextConfig;
