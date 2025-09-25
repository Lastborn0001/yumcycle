import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js config options
};

export default withPWA({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true,
  sw: "service-worker.js",
})(nextConfig);
