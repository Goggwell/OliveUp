/**
 * @type {import('next').NextConfig}
 */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wiki.cassettebeasts.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default config;
